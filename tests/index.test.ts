import * as puppeteer from 'puppeteer';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path'
import * as _ from 'lodash'
import { rimrafSync } from 'rimraf'

import changeInputModel from './models/changeInput.model';
import visitPageModel from './models/visitPage.model';
import refreshModel from './models/refresh.model';
import delayModel from './models/delay.model';
import performAction from './functions/performAction';

(async () => {

    const headless = false;

    const browser = await puppeteer.launch({
        headless, devtools: headless ? false : true, defaultViewport: headless ? {
            width: 1920,
            height: 924
        } : null,
        ignoreHTTPSErrors: true,
        args: [
            '--disable-web-security',
            '--start-maximized',
            `--no-sandbox`
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    const testCases = JSON.parse(readFileSync("./testCases.json", 'utf-8'));
    const faliedCases: any = [];

    const imagesPath = path.join("images");

    rimrafSync(imagesPath); // Delete all previous images

    mkdirSync(imagesPath, { recursive: true });
    // mkdirSync(path.join(imagesPath, "passed"), { recursive: true });
    // mkdirSync(path.join(imagesPath, "failed"), { recursive: true });

    for (let testCaseName in testCases) {

        let testCase = testCases[testCaseName];

        let { actions, shouldSucceed }: { actions: (changeInputModel | visitPageModel | visitPageModel | refreshModel | delayModel)[], shouldSucceed: boolean } = testCase;

        for (let actionObj of actions) {
            await performAction({ actionObj, page, imagesPath })
        }
    }

    writeFileSync("faliedCases.json", JSON.stringify(faliedCases));

    await browser.close();
})();
