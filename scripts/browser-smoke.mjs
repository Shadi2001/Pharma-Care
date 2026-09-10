import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const base = process.env.SMOKE_BASE_URL || 'http://localhost:5173';
const port = 9337;
await mkdir('.verification/chrome', { recursive: true });
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--disable-extensions', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${port}`, `--user-data-dir=${path.resolve('.verification/chrome')}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let tabs;
  for (let i = 0; i < 100; i++) {
    try { tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); break; } catch { await sleep(200); }
  }
  assert.ok(tabs, 'Chrome debugging endpoint started');
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  const errors = [];
  const apiRequests = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const handlers = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) handlers?.reject(new Error(message.error.message)); else handlers?.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ' ' + (message.params.exceptionDetails.exception?.description ?? ''));
    if (message.method === 'Network.requestWillBeSent' && /\/api\/(categories|products|blogs|blog-topics)/.test(message.params.request.url)) apiRequests.push(message.params.request.url);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => { pending.set(++id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 120; i++) { if (await evaluate(`Boolean(${expression})`)) return; await sleep(250); }
    throw new Error(`Timed out: ${expression}\n${await evaluate('document.body.innerText')}`);
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${base}/products?lang=en` });
  await waitFor('document.querySelectorAll("main article").length > 0');
  assert.ok(await evaluate('document.querySelector("main h1").innerText.includes("Product directory")'));
  assert.equal(await evaluate('document.documentElement.lang'), 'en');
  await waitFor('[...document.querySelectorAll("main article img")].every(i => i.complete && i.naturalWidth > 0)');
  await evaluate('document.querySelector("main article h3 a").click()');
  await waitFor('location.pathname.includes("/products/category/") && document.querySelector(\'main a[href^="/products/"]:not([href*="/category/"])\')');
  assert.ok(await evaluate('new URL(location.href).searchParams.get("lang") === "en"'));
  await evaluate('document.querySelector(\'main a[href^="/products/"]:not([href*="/category/"])\').click()');
  await waitFor('!location.pathname.includes("/category/") && document.querySelectorAll("main article").length === 1 && document.querySelector("main h1")');
  console.log('PASS: English categories -> category products -> product detail; language retained.');

  await send('Page.navigate', { url: `${base}/science` });
  await waitFor('location.pathname === "/science" && document.querySelector("main article a")');
  assert.equal(await evaluate('document.documentElement.lang'), 'ar');
  await evaluate('document.querySelector("main article a").click()');
  await waitFor('location.pathname.startsWith("/science/") && document.querySelector("main article img")?.naturalWidth > 0');
  console.log('PASS: Arabic blogs -> blog detail and API image.');

  await send('Page.navigate', { url: `${base}/products/not-a-real-product` });
  await waitFor('document.querySelector("main [role=alert]")');
  console.log('PASS: missing product renders an error state.');

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url: `${base}/products` });
  await waitFor('document.querySelectorAll("main article").length > 0');
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('.verification/products-mobile.png', Buffer.from(screenshot.data, 'base64'));
  await evaluate(`(() => { const input = document.querySelector('main input'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(input, 'zzzz-no-result'); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await waitFor('document.querySelectorAll("main article").length === 0 && document.querySelector("main [role=status]")');
  console.log('PASS: mobile width and empty search state.');
  assert.ok(apiRequests.every(url => ['ar', 'en'].includes(new URL(url).searchParams.get('lang'))));
  assert.deepEqual(errors, []);
  console.log(`PASS: ${apiRequests.length} API requests sent explicit language; no uncaught browser errors.`);
} finally { socket?.close(); browser.kill(); }
