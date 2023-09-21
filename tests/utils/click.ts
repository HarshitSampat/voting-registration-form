import { Page } from "puppeteer";

export default async function click({ page, selector }: { page: Page, selector: string }) {
    await page.evaluate((selector: string) => {
        if (selector.length > 0) {
            const ele: HTMLElement | null = document.querySelector(selector);

            if (ele) ele.click();
        }
    }, selector)
}