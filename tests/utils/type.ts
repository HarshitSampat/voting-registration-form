import { Page } from "puppeteer";

export async function type({ page, selector, value }: { page: Page, selector: string, value: string }) {
    await page.type(selector, value);
}