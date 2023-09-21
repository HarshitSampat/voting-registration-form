import { Page, PuppeteerLifeCycleEvent, WaitForOptions } from "puppeteer";

export default async function refresh({ page, waitUntil }: { page: Page, waitUntil: PuppeteerLifeCycleEvent }) {
    await page.reload({ waitUntil });
}