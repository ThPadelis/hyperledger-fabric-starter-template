const express = require("express");
const LedgerController = require("../controllers/ledger");

const app = express();

class LedgerRoutes {
    _ledgerController;
    constructor () {
        this._ledgerController = new LedgerController();
    }

    get routes() {
        const controller = this._ledgerController;

        app.post('/init', controller._initialize);

        app.post("/policies", controller._getPolicies);


        app.post("/policies/:id", controller._getPolicy);

        app.put("/policies/:id", async (request, response, next) => {

        });

        app.delete("/policies/:id", async (request, response, next) => {

        });

        app.use('**', async (request, response, next) => {
            return response.status(404).json({ message: "Not found!" })
        });

        return app;
    }
}

module.exports = LedgerRoutes;