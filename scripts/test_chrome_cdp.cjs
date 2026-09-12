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
  '--window-size=1280,2400',
  `--user-data-dir=${userDataDir}`
]);

setTimeout(() => {
  const req = http.request(
    {
      host: '127.0.0.1',
      port: 9222,
      path: '/json/new?http://localhost:5173/',
      method: 'PUT'
    },
    (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const page = JSON.parse(raw);
          console.log('Page created, WebSocket URL:', page.webSocketDebuggerUrl);

          const ws = new WebSocket(page.webSocketDebuggerUrl);

          ws.addEventListener('open', () => {
            console.log('DevTools connected!');
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));

            setTimeout(() => {
              // Click the chatbot launcher
              ws.send(JSON.stringify({
                id: 10,
                method: 'Runtime.evaluate',
                params: {
                  expression: `(() => {
                    const launcher = document.querySelector('button[aria-label="Open AI Craft Assistant Gulabi"]');
                    if (launcher) launcher.click();
                    return {
                      hasLauncher: !!launcher,
                      productCards: document.querySelectorAll('.product-card').length
                    };
                  })()`,
                  returnByValue: true
                }
              }));

              setTimeout(() => {
                ws.send(JSON.stringify({
                  id: 11,
                  method: 'Runtime.evaluate',
                  params: {
                    expression: `(() => {
                      const chatHeader = document.querySelector('h3');
                      const messages = document.querySelectorAll('.animate-fadeIn');
                      return {
                        isChatOpen: document.body.innerText.includes('Gulabi AI'),
                        messagesCount: messages.length
                      };
                    })()`,
                    returnByValue: true
                  }
                }));

                ws.send(JSON.stringify({
                  id: 12,
                  method: 'Page.captureScreenshot',
                  params: { format: 'png' }
                }));
              }, 1500);
            }, 2500);
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
