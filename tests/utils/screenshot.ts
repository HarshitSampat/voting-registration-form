import { Page } from "puppeteer";

export default async function screenshot({ page, path }: { page: Page, path: string }) {
    await page.screenshot({ path, fullPage: true });
}