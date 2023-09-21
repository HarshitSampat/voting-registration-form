import { PuppeteerLifeCycleEvent } from "puppeteer";
import action from "./action.model";

export default interface refreshModel extends action {
    "waitUntil": PuppeteerLifeCycleEvent
}