const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_profile_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1280,1000',
  `--user-data-dir=${userDataDir}`
]);

setTimeout(() => {
  const req = http.request(
    {
      host: '127.0.0.1',
      port: 9223,
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
            ws.send(JSON.stringify({ id: 3, method: 'Console.enable' }));

            // Wait 6.5 seconds for initial bundle compile + 3.5s sales popup delay
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 10,
                method: 'Runtime.evaluate',
                params: {
                  expression: `(() => {
                    const aside = document.querySelector('aside[aria-label*="Recent customer purchase notification"]');
                    if (!aside) return { found: false, htmlLength: document.body.innerHTML.length, hasRoot: !!document.getElementById('root') };
                    
                    const buyerEl = aside.querySelector('.font-bold.text-ink');
                    const cityEl = aside.querySelector('.font-semibold.text-terracotta');
                    const qtyEl = aside.querySelector('.text-rose.font-bold');
                    const titleEl = aside.querySelector('h4');
                    const imgEl = aside.querySelector('img');
                    
                    return {
                      found: true,
                      isVisible: aside.className.includes('translate-y-0') || aside.className.includes('opacity-100'),
                      buyer: buyerEl ? buyerEl.textContent : null,
                      city: cityEl ? cityEl.textContent.trim() : null,
                      quantity: qtyEl ? qtyEl.textContent : null,
                      productTitle: titleEl ? titleEl.textContent : null,
                      productImgSrc: imgEl ? imgEl.src : null,
                      bounds: aside.getBoundingClientRect()
                    };
                  })()`,
                  returnByValue: true
                }
              }));
            }, 6500);
          });

          ws.addEventListener('message', (event) => {
            const resp = JSON.parse(event.data);
            
            if (resp.id === 10) {
              console.log('SALES POPUP INSPECTION:', JSON.stringify(resp.result?.result?.value, null, 2));

              // Take screenshot of popup
              ws.send(JSON.stringify({
                id: 11,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }

            if (resp.id === 11 && resp.result?.data) {
              const artifactDir = 'C:\\Users\\madan\\.gemini\\antigravity-ide\\brain\\aaa20af3-8b25-4326-9d59-7fe1632d72ec';
              fs.writeFileSync(path.join(artifactDir, 'sales_popup_screenshot.png'), Buffer.from(resp.result.data, 'base64'));
              console.log('Saved screenshot to sales_popup_screenshot.png');

              // Now test clicking the popup to open the ProductModal
              ws.send(JSON.stringify({
                id: 20,
                method: 'Runtime.evaluate',
                params: {
                  expression: `(() => {
                    const clickableCard = document.querySelector('aside[aria-label*="Recent customer purchase notification"] .group');
                    if (clickableCard) {
                      clickableCard.click();
                      return true;
                    }
                    return false;
                  })()`,
                  returnByValue: true
                }
              }));

              // Wait 1 second to inspect if ProductModal opened
              setTimeout(() => {
                ws.send(JSON.stringify({
                  id: 21,
                  method: 'Runtime.evaluate',
                  params: {
                    expression: `(() => {
                      const modal = document.querySelector('[role="dialog"]');
                      const modalTitle = modal ? modal.querySelector('h3, h2')?.textContent : null;
                      return {
                        modalOpened: !!modal,
                        modalTitle
                      };
                    })()`,
                    returnByValue: true
                  }
                }));
              }, 1000);
            }

            if (resp.id === 21) {
              console.log('PRODUCT MODAL CLICK VERIFICATION:', JSON.stringify(resp.result?.result?.value, null, 2));

              // Take screenshot of opened modal
              ws.send(JSON.stringify({
                id: 22,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }

            if (resp.id === 22 && resp.result?.data) {
              const artifactDir = 'C:\\Users\\madan\\.gemini\\antigravity-ide\\brain\\aaa20af3-8b25-4326-9d59-7fe1632d72ec';
              fs.writeFileSync(path.join(artifactDir, 'product_modal_opened.png'), Buffer.from(resp.result.data, 'base64'));
              console.log('Saved screenshot to product_modal_opened.png');
              ws.close();
              chrome.kill();
              process.exit(0);
            }

            if (resp.method === 'Runtime.consoleAPICalled') {
              console.log('BROWSER CONSOLE:', resp.params?.type, ...resp.params?.args.map(a => a.value || a.description));
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
