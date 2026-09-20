const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_perf_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1280,1000',
  `--user-data-dir=${userDataDir}`
]);

setTimeout(() => {
  const req = http.request(
    {
      host: '127.0.0.1',
      port: 9225,
      path: '/json/new?https://craftofpinkcity.shop/',
      method: 'PUT'
    },
    (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const page = JSON.parse(raw);
          const ws = new WebSocket(page.webSocketDebuggerUrl);

          let networkTransferBytes = 0;
          let resourceCount = 0;

          ws.addEventListener('open', () => {
            ws.send(JSON.stringify({ id: 1, method: 'Performance.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
            ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));

            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 10,
                method: 'Runtime.evaluate',
                params: {
                  expression: `(() => {
                    const perf = window.performance;
                    const nav = perf.getEntriesByType('navigation')[0] || {};
                    const paint = perf.getEntriesByType('paint');
                    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
                    const fp = paint.find(p => p.name === 'first-paint')?.startTime || 0;
                    
                    const resources = perf.getEntriesByType('resource').map(r => ({
                      name: r.name.split('/').pop().split('?')[0],
                      initiatorType: r.initiatorType,
                      duration: Math.round(r.duration),
                      transferSize: r.transferSize || 0
                    }));

                    return {
                      dnsTime: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
                      connectTime: Math.round(nav.connectEnd - nav.connectStart),
                      ttfb: Math.round(nav.responseStart - nav.requestStart),
                      domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
                      loadEvent: Math.round(nav.loadEventEnd - nav.startTime),
                      firstPaint: Math.round(fp),
                      firstContentfulPaint: Math.round(fcp),
                      totalResources: resources.length,
                      resourcesSummary: resources.slice(0, 15)
                    };
                  })()`,
                  returnByValue: true
                }
              }));
            }, 4000);
          });

          ws.addEventListener('message', (event) => {
            const resp = JSON.parse(event.data);
            if (resp.method === 'Network.loadingFinished') {
              networkTransferBytes += resp.params?.encodedDataLength || 0;
              resourceCount++;
            }
            if (resp.id === 10) {
              console.log('--- PERFORMANCE METRICS ---');
              console.log(JSON.stringify({
                ...resp.result?.result?.value,
                totalNetworkTransferKB: Math.round(networkTransferBytes / 1024)
              }, null, 2));
              ws.close();
              chrome.kill();
              process.exit(0);
            }
          });
        } catch (e) {
          console.error('Error:', e);
          chrome.kill();
          process.exit(1);
        }
      });
    }
  );
  req.end();
}, 2000);
