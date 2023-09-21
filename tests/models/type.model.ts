import action from "./action.model";
import selector from "./selector.model";

export default interface typeModel extends action, selector {
    value: string
}