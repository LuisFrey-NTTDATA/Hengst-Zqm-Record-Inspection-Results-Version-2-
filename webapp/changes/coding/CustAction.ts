import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";

/**
 * @namespace customer.zqm.recinspresult
 * @controller
 */
export default class CustAction extends ControllerExtension {
  overrides = {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf customer.zqm.recinspresult.CustAction
     */
    onInit(this: CustAction) {
      const view = this.getView();
    },
  };
}
