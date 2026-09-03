import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";

/**
 * @namespace customer.zqm.recinspresult
 * @controller
 */
export default class CustAction extends ControllerExtension {
  private _oDocumentDialog?: Dialog;

  static overrides = {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     */
    onInit(this: CustAction) {
      const view = this.getView();
    },
  };

  public async onOpenDocumentDialog(this: CustAction): Promise<void> {
    const oView = this.getView();

    if (!this._oDocumentDialog) {
      this._oDocumentDialog = (await Fragment.load({
        id: oView.getId(),
        name: "customer.zqm.recinspresult.changes.fragments.DocumentDialog",
        controller: this
      })) as Dialog;

      oView.addDependent(this._oDocumentDialog);
    }

    this._oDocumentDialog.open();
  }

  public onCloseDocumentDialog(this: CustAction): void {
    this._oDocumentDialog?.close();
  }
}