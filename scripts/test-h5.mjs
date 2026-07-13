import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 750 });

  const consoleLogs = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    pageErrors.push(`[PAGE ERROR] ${err.message}\n${err.stack || ''}`);
  });
  page.on('requestfailed', req => {
    failedRequests.push(`[FAILED] ${req.url()} - ${req.failure()?.errorText}`);
  });

  console.log('Loading http://localhost:5174/ ...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Wait for Vue to render
  await new Promise(r => setTimeout(r, 3000));

  const appContent = await page.evaluate(() => {
    const app = document.querySelector('#app');
    return {
      hasApp: !!app,
      childCount: app ? app.children.length : 0,
      innerHTML: app ? app.innerHTML.substring(0, 1000) : 'no #app',
      bodyText: document.body.innerText.substring(0, 500)
    };
  });

  console.log('\n=== PAGE ERRORS ===');
  if (pageErrors.length === 0) console.log('None');
  pageErrors.forEach(e => console.log(e));

  console.log('\n=== FAILED REQUESTS ===');
  if (failedRequests.length === 0) console.log('None');
  failedRequests.forEach(r => console.log(r));

  console.log('\n=== CONSOLE LOGS (last 30) ===');
  consoleLogs.slice(-30).forEach(l => console.log(l));

  console.log('\n=== APP CONTENT ===');
  console.log('Has #app:', appContent.hasApp);
  console.log('Children:', appContent.childCount);
  console.log('innerHTML:', appContent.innerHTML);
  console.log('bodyText:', appContent.bodyText);

} catch (err) {
  console.error('Test failed:', err.message);
} finally {
  await browser.close();
}
