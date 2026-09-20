const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_mobile_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9226',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=390,844',
  `--user-data-dir=${userDataDir}`
]);

setTimeout(() => {
  const req = http.request(
    {
      host: '127.0.0.1',
      port: 9226,
      path: '/json/new?http://localhost:5173/',
      method: 'PUT'
    },
    (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const page = JSON.parse(raw);
          const ws = new WebSocket(page.webSocketDebuggerUrl);

          ws.addEventListener('open', () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
            ws.send(JSON.stringify({
              id: 3,
              method: 'Emulation.setDeviceMetricsOverride',
              params: {
                width: 390,
                height: 844,
                deviceScaleFactor: 2,
                mobile: true
              }
            }));

            // Wait 2.2 seconds for Sales Popup to emerge
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 10,
                method: 'Runtime.evaluate',
                params: {
                  expression: `(() => {
                    const aside = document.querySelector('aside[aria-label*="order"]');
                    if (!aside) return { found: false };
                    const card = aside.querySelector('.group');
                    const rect = card.getBoundingClientRect();
                    return {
                      found: true,
                      height: Math.round(rect.height),
                      width: Math.round(rect.width),
                      bottom: Math.round(rect.bottom),
                      text: aside.innerText
                    };
                  })()`,
                  returnByValue: true
                }
              }));
            }, 2200);
          });

          ws.addEventListener('message', (event) => {
            const resp = JSON.parse(event.data);
            
            if (resp.id === 10) {
              console.log('MOBILE POPUP METRICS:', JSON.stringify(resp.result?.result?.value, null, 2));

              // Take mobile screenshot
              ws.send(JSON.stringify({
                id: 11,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }

            if (resp.id === 11 && resp.result?.data) {
              const artifactDir = 'C:\\Users\\madan\\.gemini\\antigravity-ide\\brain\\aaa20af3-8b25-4326-9d59-7fe1632d72ec';
              fs.writeFileSync(path.join(artifactDir, 'mobile_popup_screenshot.png'), Buffer.from(resp.result.data, 'base64'));
              console.log('Saved screenshot to mobile_popup_screenshot.png');
              ws.close();
              chrome.kill();
              process.exit(0);
            }
          });
        } catch (e) {
          console.error(e);
          chrome.kill();
          process.exit(1);
        }
      });
    }
  );
  req.end();
}, 2000);
