import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.AGENTIC_HUB_PLAYWRIGHT || 'playwright');
const root = normalize(join(fileURLToPath(new URL('.', import.meta.url)), '..'));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = normalize(join(root, relative));
    if (!target.startsWith(root)) throw new Error('invalid path');
    const info = await stat(target);
    if (!info.isFile()) throw new Error('not a file');
    response.writeHead(200, { 'content-type': mime[extname(target)] || 'application/octet-stream' });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404); response.end('Not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });

try {
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  const dimensions = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  if (dimensions.scrollWidth > dimensions.width) throw new Error(`mobile horizontal overflow: ${JSON.stringify(dimensions)}`);

  await page.locator('[data-nav-toggle]').click();
  const navLink = page.locator('#siteNav a[href="https://calendar.agenticfabworks.com/"]');
  if (!(await navLink.isVisible())) throw new Error('mobile calendar navigation link is not visible');

  const card = page.locator('.tool-card[href="https://calendar.agenticfabworks.com/"]');
  if (await card.count() !== 1) throw new Error('calendar featured card is missing or duplicated');
  if (await page.locator('.tool-card[data-featured="true"]:not([hidden])').count() !== 7) throw new Error('featured tool count is not 7');

  await navLink.click();
  await page.waitForURL('https://calendar.agenticfabworks.com/', { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');
  if (!String(await page.title()).includes('캘린더 서클')) throw new Error('calendar destination title mismatch');

  console.log(JSON.stringify({ ok: true, mobile: dimensions, navVisible: true, calendarCard: 1, featuredCards: 7, destination: page.url(), title: await page.title() }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
