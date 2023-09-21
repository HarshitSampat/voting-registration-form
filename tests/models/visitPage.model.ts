import { PuppeteerLifeCycleEvent, WaitForOptions } from "puppeteer";
import action from "./action.model";

export default interface visitPageModel extends action {
    "url": string,
    "waitUntil": WaitForOptions,
}