const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const WebSocket = require(path.join(__dirname, 'node_modules', 'ws'));

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(os.tmpdir(), 'chrome-test-' + Date.now());
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--disable-gpu',
  `--user-data-dir=${userDataDir}`,
  'https://orlandopasion000.github.io/orlandochrome/'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9225/json/list', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const targets = JSON.parse(data);
      const page = targets.find(t => t.type === 'page');
      if (!page) { console.log('No page target found'); chrome.kill(); return; }
      console.log('Page target found, connecting...');
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.on('open', () => {
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Console.enable' }));
        
        setTimeout(() => {
          console.log('Sending evaluate to click #openQrBtn...');
          ws.send(JSON.stringify({
            id: 3,
            method: 'Runtime.evaluate',
            params: {
              expression: `(() => {
                const btn = document.querySelector('#openQrBtn');
                if (!btn) return 'BTN_NOT_FOUND';
                btn.click();
                const modal = document.querySelector('.qr-studio-modal');
                return modal ? 'MODAL_OPENED: ' + modal.innerHTML.slice(0, 200) : 'NO_MODAL';
              })()`
            }
          }));
        }, 2000);
      });

      ws.on('message', (msg) => {
        const parsed = JSON.parse(msg);
        if (parsed.method === 'Runtime.consoleAPICalled') {
          console.log('[BROWSER CONSOLE]', parsed.params.type, parsed.params.args.map(a => a.value || a.description));
        } else if (parsed.method === 'Runtime.exceptionThrown') {
          console.error('[BROWSER EXCEPTION]', JSON.stringify(parsed.params.exceptionDetails));
        } else if (parsed.id === 3) {
          console.log('[CLICK RESULT]:', JSON.stringify(parsed.result));
          setTimeout(() => { chrome.kill(); process.exit(0); }, 500);
        }
      });
    });
  }).on('error', e => {
    console.error('HTTP Error:', e.message);
    chrome.kill();
  });
}, 2000);
