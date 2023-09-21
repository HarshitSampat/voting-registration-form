import { Page } from "puppeteer";

export default async function getElement({ page, selector }: { page: Page, selector: string }) {
    return (await page.$(selector));
}