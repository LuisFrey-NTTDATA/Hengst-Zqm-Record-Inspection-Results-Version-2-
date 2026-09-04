import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace customer.zqm.recinspresult
 * @controller
 */
export default class CustAction extends ControllerExtension {
  private _oDocumentDialog?: Dialog;

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

    try {
      const sInspectionLot = this._getInspectionLotFromHash();
      const aDocs = await this._loadDocuments(sInspectionLot);

      if (!aDocs || aDocs.length === 0) {
        MessageBox.error(`Keine Dokumente für Inspection Lot ${sInspectionLot} gefunden.`);
        return; // Dialog nicht öffnen
      }

      const oDocsModel = new JSONModel({ items: aDocs });
      this._oDocumentDialog.setModel(oDocsModel, "docs");
      this._oDocumentDialog.open();

    } catch (e) {
      MessageBox.error("Fehler beim Laden der Dokumente.");
    }
  }

  public onCloseDocumentDialog(this: CustAction): void {
    this._oDocumentDialog?.close();
  }

  private _getInspectionLotFromHash(this: CustAction): string {
    const sHash = window.location.hash || "";
    const m = sHash.match(/InspectionLot\('([^']+)'\)/);
    return m?.[1] ?? "";
  }

  private async _loadDocuments(this: CustAction, sInspectionLot: string): Promise<any[]> {
    if (!sInspectionLot) {
      return [];
    }

    const sServiceRoot =
      "/sap/opu/odata4/sap/zui_insplotdoc_v4/srvd/sap/zinsplotdoc_sd/0001/";
    const sFilter = encodeURIComponent(`InspectionLot eq '${sInspectionLot}'`);
    const sSelect = [
      "InspectionLot",
      "DocumentInfoRecordDocType",
      "DocumentInfoRecordDocNumber",
      "DocumentInfoRecordDocVersion",
      "DocumentInfoRecordDocPart",
      "DocumentDescription"
    ].join(",");

    const sUrl = `${sServiceRoot}InspLotDoc?$filter=${sFilter}&$select=${sSelect}`;

    const oResponse = await fetch(sUrl, {
      method: "GET",
      headers: { "Accept": "application/json" },
      credentials: "include"
    });

    if (!oResponse.ok) {
      throw new Error(`HTTP ${oResponse.status}`);
    }

    const oData = await oResponse.json();
    return oData?.value ?? [];
  }
}