import changeInputModel from "../models/changeInput.model";
import checkInterface from "../interfaces/checkInterface";
import clickModel from "../models/click.model";
import delayModel from "../models/delay.model";
import refreshModel from "../models/refresh.model";
import screenshotModel from "../models/screenshot.model";
import visitPageModel from "../models/visitPage.model";
import getElementModel from "../models/getElement.model";
import typeModel from "../models/type.model";

export function isChangeInputModel(variableTocheck: any): variableTocheck is changeInputModel {

    const checkChangeInputModel: checkInterface<changeInputModel> = (obj: any): obj is changeInputModel => {
        return "action" in obj && "inputType" in obj && "selector" in obj && "value" in obj;
    };

    return checkChangeInputModel(variableTocheck);
}

export function isVisitPageModel(variableTocheck: any): variableTocheck is visitPageModel {

    const checkVisitPageModel: checkInterface<visitPageModel> = (obj: any): obj is visitPageModel => {
        return "action" in obj && "url" in obj && "waitUntil" in obj;
    };

    return checkVisitPageModel(variableTocheck);
}

export function isRefreshModel(variableTocheck: any): variableTocheck is refreshModel {

    const checkRefreshModel: checkInterface<refreshModel> = (obj: any): obj is refreshModel => {
        return "action" in obj && "waitUntil" in obj;
    };

    return checkRefreshModel(variableTocheck);
}


export function isDelayModel(variableTocheck: any): variableTocheck is delayModel {

    const checkDelayModel: checkInterface<delayModel> = (obj: any): obj is delayModel => {
        return "action" in obj && "timeInMs" in obj;
    };

    return checkDelayModel(variableTocheck);
}

export function isClickModel(variableTocheck: any): variableTocheck is clickModel {

    const checkClickModel: checkInterface<clickModel> = (obj: any): obj is clickModel => {
        return "action" in obj && "selector" in obj;
    };

    return checkClickModel(variableTocheck);
}

export function isScreenshotModel(variableTocheck: any): variableTocheck is screenshotModel {

    const checkScreenshotModel: checkInterface<screenshotModel> = (obj: any): obj is screenshotModel => {
        return "action" in obj && "fileName" in obj;
    };

    return checkScreenshotModel(variableTocheck);
}

export function isGetElementModel(variableTocheck: any): variableTocheck is getElementModel {

    const checkGetElementModel: checkInterface<getElementModel> = (obj: any): obj is getElementModel => {
        return "action" in obj && "selector" in obj;
    };

    return checkGetElementModel(variableTocheck);
}


export function isTypeModel(variableTocheck: any): variableTocheck is typeModel {

    const checkTypeModel: checkInterface<typeModel> = (obj: any): obj is typeModel => {
        return "action" in obj && "selector" in obj && "value" in obj;
    };

    return checkTypeModel(variableTocheck);
}