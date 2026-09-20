const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_profile_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9224',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1280,1000',
  `--user-data-dir=${userDataDir}`
]);

setTimeout(() => {
  const req = http.request(
    {
      host: '127.0.0.1',
      port: 9224,
      path: '/json/new?https://craftofpinkcity.shop/',
      method: 'PUT'
    },
    (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const page = JSON.parse(raw);
          console.log('Live page created, WebSocket URL:', page.webSocketDebuggerUrl);

          const ws = new WebSocket(page.webSocketDebuggerUrl);

          ws.addEventListener('open', () => {
            console.log('DevTools connected to live website!');
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));

            // Wait 5 seconds to inspect live DOM
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 10,
                method: 'Runtime.evaluate',
                params: {
                  expression: `(() => {
                    const aside = document.querySelector('aside[aria-label*="Recent customer purchase notification"]');
                    if (!aside) return { found: false, htmlLen: document.body.innerHTML.length };
                    
                    return {
                      found: true,
                      className: aside.className,
                      isVisible: aside.className.includes('translate-y-0') || aside.className.includes('opacity-100'),
                      text: aside.innerText,
                      rect: aside.getBoundingClientRect()
                    };
                  })()`,
                  returnByValue: true
                }
              }));
            }, 5000);
          });

          ws.addEventListener('message', (event) => {
            const resp = JSON.parse(event.data);
            
            if (resp.id === 10) {
              console.log('LIVE DOM RESULT:', JSON.stringify(resp.result?.result?.value, null, 2));

              // Take screenshot of live site
              ws.send(JSON.stringify({
                id: 11,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }

            if (resp.id === 11 && resp.result?.data) {
              const artifactDir = 'C:\\Users\\madan\\.gemini\\antigravity-ide\\brain\\aaa20af3-8b25-4326-9d59-7fe1632d72ec';
              fs.writeFileSync(path.join(artifactDir, 'live_website_check.png'), Buffer.from(resp.result.data, 'base64'));
              console.log('Saved live screenshot to live_website_check.png');
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
