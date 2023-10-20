sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
], function(Controller, ODataModel, JSONModel, formatter) {
    "use strict";
    return Controller.extend("sap.ui.demo.browserorders.controller.Detail", {
        formatter: formatter,
        onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function(oEvent) {
            this.getView().setModel(new JSONModel([]), "items");
            this.byId('orderDetailsTable').setBusy(true)
            const orderID = oEvent.getParameter("arguments").orderId
            const oData = new ODataModel("/northwind/northwind.svc/");
            oData.read(`/Orders(${orderID})`, {
                urlParameters: {
                    "$expand": "Order_Details/Product,Shipper,Employee"
                },
                success: function(data) {
                    const jsonModel = new JSONModel(data);
                    this.getView().setModel(jsonModel, "items");

                    var totalPrice = this.calculateTotalPrice();
                    var totalsModel = new JSONModel({ totalPrice: totalPrice });
                    this.getView().setModel(totalsModel, "totals");

                    this.byId('orderDetailsTable').setBusy(false)
                }.bind(this),
                error: function(error) {
                    this.byId('orderDetailsTable').setBusy(false)
                    console.error("Erro ao carregar os dados:", error);
                }
            });
        },
        calculateTotalPrice: function() {
            var oTable = this.byId("orderDetailsTable");
            var oItems = oTable.getItems();
            var totalPrice = 0;

            oItems.forEach(function(oItem) {
                var oContext = oItem.getBindingContext("items");
                var unitPrice = oContext.getProperty("UnitPrice");
                var quantity = oContext.getProperty("Quantity");

                if (unitPrice && quantity) {
                    totalPrice += parseFloat(unitPrice) * parseFloat(quantity);
                }
            });

            return totalPrice;
        },
    });
});