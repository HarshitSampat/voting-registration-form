import { Page, PuppeteerLifeCycleEvent, WaitForOptions } from "puppeteer";

export default async function visitPage({ page, url, waitUntil }: { page: Page, url: string, waitUntil: WaitForOptions }) {
    await page.goto(url, waitUntil);
}