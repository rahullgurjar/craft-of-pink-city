const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_profile_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=${userDataDir}`
]);

setTimeout(() => {
  const req = http.request(
    {
      host: '127.0.0.1',
      port: 9222,
      path: '/json/new?https://craftofpinkcity.shop/',
      method: 'PUT'
    },
    (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const page = JSON.parse(raw);
          console.log('Page created, WebSocket URL:', page.webSocketDebuggerUrl);

          // Native WebSocket in Node 22+
          const ws = new WebSocket(page.webSocketDebuggerUrl);

          ws.addEventListener('open', () => {
            console.log('DevTools connected!');
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
            ws.send(JSON.stringify({ id: 3, method: 'Console.enable' }));

            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 10,
                method: 'Runtime.evaluate',
                params: {
                  expression: `JSON.stringify({
                    rootLength: document.getElementById('root')?.innerHTML.length,
                    hasProductsSection: !!document.getElementById('products'),
                    productCardCount: document.querySelectorAll('.product-card').length,
                    productTitleCount: document.querySelectorAll('article h3').length,
                    headings: Array.from(document.querySelectorAll('h2, h3')).slice(0, 10).map(h => h.innerText.replace(/\\n/g, ' ')),
                    imgCount: document.querySelectorAll('img').length
                  })`
                }
              }));
              ws.send(JSON.stringify({
                id: 12,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 3000);
          });

          ws.addEventListener('message', (event) => {
            const resp = JSON.parse(event.data);
            if (resp.id === 10) {
              console.log('DOM INSPECTION RESULT:', resp.result?.result?.value);
            }
            if (resp.id === 12 && resp.result?.data) {
              fs.writeFileSync('live_rendered_proof.png', Buffer.from(resp.result.data, 'base64'));
              console.log('Screenshot saved to live_rendered_proof.png!');
              ws.close();
              chrome.kill();
              process.exit(0);
            }
            if (resp.method === 'Runtime.exceptionThrown') {
              console.error('JS EXCEPTION THROWN:', JSON.stringify(resp.params));
            }
          });
        } catch (e) {
          console.error('JSON parse error:', e, 'Raw output was:', raw);
          chrome.kill();
          process.exit(1);
        }
      });
    }
  );
  req.end();
}, 2000);
