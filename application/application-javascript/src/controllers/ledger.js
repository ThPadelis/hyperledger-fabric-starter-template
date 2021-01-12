const { Wallets, Gateway } = require("fabric-network");
const { buildCCPOrg1, buildWallet } = require("../../../../test-application/javascript/AppUtil");
const path = require("path");

const walletPath = path.join(__dirname, "..", "wallet");
const channelName = "mychannel";
const chaincodeName = "trapeze";

class LedgerController {
    async _initialize(request, response, next) {
        const { userID: org1UserId, organization: mspOrg1 } = request.body;

        console.log(`Ledger is about to be initialized ${mspOrg1}`);

        try {
            const ccp = buildCCPOrg1();
            const wallet = await buildWallet(Wallets, walletPath);

            const gateway = new Gateway();
            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true },
                });

                const network = await gateway.getNetwork(channelName);
                const contract = network.getContract(chaincodeName);

                console.log("\n--> Submit Transaction: InitLedger, function creates the initial set of policies on the ledger");
                await contract.submitTransaction("InitLedger");
                console.log("*** Result: committed");

                return response.status(201).json({ message: `Ledger initialized for organisation ${mspOrg1}` });
            } catch (error) {
                return response.status(400).json({
                    message: `Failed to set up the ledger`,
                    error
                });
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to initialize the ledger: ${error}`);
            return response.status(500).json({ message: error.message });
        }
    }

    async _getPolicies(request, response, next) {
        const { userID: org1UserId } = request.body;

        console.log(`About to get all policies from the ledger`);

        try {
            const ccp = buildCCPOrg1();
            const wallet = await buildWallet(Wallets, walletPath);

            const gateway = new Gateway();
            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true },
                });

                const network = await gateway.getNetwork(channelName);
                const contract = network.getContract(chaincodeName);

                console.log("\n--> Evaluate Transaction: GetAllPolicies, function fetches all policies from the ledger");
                const policies = await contract.evaluateTransaction("GetAllPolicies");
                console.log("*** Result: committed");

                return response.status(200).json({ policies: JSON.parse(policies) });
            } catch (error) {
                return response.status(400).json({
                    message: `Failed to fetch policies from the ledger`,
                    error
                });
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to fetch policies from the ledger: ${error}`);
            return response.status(500).json({ message: error.message });
        }

    }

    async _getPolicy(request, response, next) {
        const { userID: org1UserId } = request.body;
        const { id: policyID } = request.params;

        console.log(`About to get policy from the ledger`);

        try {
            const ccp = buildCCPOrg1();
            const wallet = await buildWallet(Wallets, walletPath);

            const gateway = new Gateway();
            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true },
                });

                const network = await gateway.getNetwork(channelName);
                const contract = network.getContract(chaincodeName);

                console.log("\n--> Evaluate Transaction: ReadPolicy, function fetches all policies from the ledger");
                const policy = await contract.evaluateTransaction("ReadPolicy", [policyID]);
                console.log("*** Result: committed");

                return response.status(200).json({ policy: JSON.parse(policy) });
            } catch (error) {
                return response.status(400).json({
                    message: `Failed to fetch policy from the ledger`,
                    error
                });
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to fetch policies from the ledger: ${error}`);
            return response.status(500).json({ message: error.message });
        }

    }
}

module.exports = LedgerController;