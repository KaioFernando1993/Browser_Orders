sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";
    return Controller.extend("sap.ui.demo.browserorders.controller.Detail", {
        onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function(oEvent) {
            const orderID = oEvent.getParameter("arguments").orderId
            console.log(`Orders(${orderID})`)
            var oDataModel = this.getView().getModel(); // Obtenha o modelo OData
            var oTable = this.getView().byId("orderDetailsTable"); // Substitua pelo ID correto da sua tabela

            // Crie um filtro para corresponder ao OrderID
            var oFilter = new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, orderID);

            // Aplique o filtro à tabela
            oTable.getBinding("items").filter([oFilter])
        }
    });
});