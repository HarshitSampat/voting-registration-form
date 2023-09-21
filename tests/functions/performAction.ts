import * as path from 'path'

import { Page } from "puppeteer";
import { actionType } from "../enums/actionType.enum";
import visitPage from "../utils/visitPage";
import { isChangeInputModel, isClickModel, isDelayModel, isGetElementModel, isRefreshModel, isScreenshotModel, isTypeModel, isVisitPageModel } from "./isInstanceOfInterface";
import refresh from "../utils/refresh";
import isInstanceOfInterface from "../generics/isInstanceOfInterface";
import changeInput from "../utils/changeInput";
import chalk = require("chalk");
import delay from "../utils/delay";
import click from "../utils/click";
import screenshot from "../utils/screenshot";
import getElement from '../utils/getElement';
import { type } from "../utils/type";

export default async function performAction({ actionObj, page, imagesPath }: { actionObj: any, page: Page, imagesPath: string }) {
    let { action }: { action: actionType } = actionObj

    switch (action) {
        case (actionType.visitPage):

            if (isVisitPageModel(actionObj)) {
                let { url, waitUntil } = actionObj;
                await visitPage({ page, url, waitUntil });
            }
            break;
        case (actionType.refresh):
            if (isRefreshModel(actionObj)) {
                let { waitUntil } = actionObj;
                await refresh({ page, waitUntil });
            }
            break;
        case (actionType.changeInput):
            if (isChangeInputModel(actionObj)) {
                var { inputType, selector, value }: { inputType: string, selector: string, value: string } = actionObj;

                if (isInstanceOfInterface(actionObj, isChangeInputModel)) {
                    await changeInput({ page, inputType, selector, value });
                } else {
                    console.log(chalk.red(`--------------- ${action} is not valid, something is wrong. ---------------`))
                }
            }
            break;
        case (actionType.delay):
            if (isDelayModel(actionObj)) {
                let { timeInMs } = actionObj;
                await delay(timeInMs);
            }
            break;
        case (actionType.click):
            if (isClickModel(actionObj)) {
                let { selector }: { selector: string } = actionObj;
                await click({ page, selector })
            }
            break;
        case (actionType.screenshot):
            if (isScreenshotModel(actionObj)) {
                let { fileName } = actionObj;
                await screenshot({ page, path: path.join(imagesPath, `${fileName}.png`) });
            }
            break;
        case (actionType.getElement):
            if (isGetElementModel(actionObj)) {
                let { selector } = actionObj;
                const element = await getElement({ page, selector });

                if (!element) console.log(chalk.red(`Element with selector : ${selector} not found.`))
            }
            break;
        case (actionType.type):
            if (isTypeModel(actionObj)) {
                let { value } = actionObj;
                await type({ page, selector, value });
            }
            break;
        default:
            console.log(chalk.red(`--------------- ${action} is not valid action type ---------------`))
            break;
    }
}