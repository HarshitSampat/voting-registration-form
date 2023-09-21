import click from './click';
import { type } from './type';
import { Page } from "puppeteer";

export default async function changeInput({ page, inputType, selector, value }: { page: Page, inputType: string, selector: string, value: string }) {

    if (!["radio", "checkbox"].includes(inputType)) await type({ page, selector, value });
    else await click({ page, selector });
}