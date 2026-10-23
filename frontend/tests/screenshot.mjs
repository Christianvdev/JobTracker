import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = 'http://localhost:5173';
const output = 'tests/screenshots';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 }, deviceScaleFactor: 1 });
const failures = [];
page.on('pageerror', (error) => failures.push(error.message));

try {
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Login' }).waitFor();
  await page.screenshot({ path: `${output}/01-login.png`, fullPage: true });

  await page.getByRole('button', { name: 'Register here.' }).click();
  await page.getByRole('heading', { name: 'Register' }).waitFor();
  const username = `visual_test_${Date.now()}`;
  await page.getByPlaceholder('username').fill(username);
  await page.getByPlaceholder('email').fill(`${username}@example.com`);
  await page.getByPlaceholder('password').fill('TestPassword123!');

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Register', exact: true }).click();
  // Registration currently uses an alert rather than redirecting.
  await page.getByRole('button', { name: /Already have an account/ }).click();
  await page.getByPlaceholder('username').fill(username);
  await page.getByPlaceholder('password').fill('TestPassword123!');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.waitForURL('**/dashboard');

  await page.getByRole('button', { name: 'Add Job' }).click();
  await page.waitForURL('**/add-job');
  await page.screenshot({ path: `${output}/02-add-job.png`, fullPage: true });

  await page.getByPlaceholder('Company Name').fill('Example Software');
  await page.getByPlaceholder('Role title').fill('Junior Software Developer');
  await page.getByPlaceholder('Job link').fill('https://example.com/careers');
  await page.getByPlaceholder('Notes').fill('Example application created during automated browser testing.');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForURL('**/dashboard');
  await page.getByText('Example Software').waitFor();

  await page.getByRole('button', { name: 'Add Job' }).click();
  await page.getByPlaceholder('Company Name').fill('Example IT Services');
  await page.getByPlaceholder('Role title').fill('IT Support Technician');
  await page.getByPlaceholder('Notes').fill('Second sample application.');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForURL('**/dashboard');
  await page.getByText('Example IT Services').waitFor();
  await page.screenshot({ path: `${output}/03-dashboard.png`, fullPage: true });

  const firstCard = page.locator('.job-card').filter({ hasText: 'Example Software' });
  await firstCard.getByRole('button', { name: 'Show Notes' }).click();
  await firstCard.getByText('Example application created during automated browser testing.').waitFor();
  await page.screenshot({ path: `${output}/04-dashboard-notes.png`, fullPage: true });

  await firstCard.getByRole('button', { name: 'edit' }).click();
  await page.waitForURL('**/edit-job/*');
  await page.getByPlaceholder('Role title').fill('Software Engineer I');
  await page.screenshot({ path: `${output}/05-edit-job.png`, fullPage: true });
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForURL('**/dashboard');
  await page.getByText('Software Engineer I').waitFor();

  const updatedCard = page.locator('.job-card').filter({ hasText: 'Example Software' });
  await updatedCard.getByRole('button', { name: 'remove' }).click();
  await updatedCard.waitFor({ state: 'detached' });
  assert.equal(await page.locator('.job-card').count(), 1);

  assert.deepEqual(failures, [], 'Browser JavaScript errors occurred');
  console.log('PASS: register, login, add, list, expand notes, edit, and delete using real Django API');
  console.log('Screenshots saved in', output);
} finally {
  await browser.close();
}
