const { Wallets, Gateway } = require("fabric-network");
const { buildCCPOrg1, buildWallet } = require("../../../../test-application/javascript/AppUtil");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const walletPath = path.join(__dirname, "..", "wallet");
const channelName = "mychannel";
const chaincodeName = "trapeze";

class LedgerController {
    async _initialize(request, response, next) {
        const { userID: org1UserId = "admin", organization: mspOrg1 = "Org1MSP" } = request.body;

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

    async _createPolicy(request, response, next) {
        const { userID: org1UserId = "", creationDate = "", hasDataSubject = "", hasPersonalDataCategory = "", hasProcessing = "", hasPurpose = "", hasRecipient = "", hasStorage = { location: "", duration: "" } } = request.body;
        const id = uuidv4();

        console.log(`About to create new policy and insert it into the ledger`);

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

                console.log("\n--> Submit Transaction: CreatePolicy, function creates and inserts a new policy into the ledger");
                const newPolicy = await contract.submitTransaction("CreatePolicy", id, creationDate, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasStorage.location, hasStorage.duration);
                console.log("*** Result: committed");

                // console.log("\n--> Evaluate Transaction: ReadPolicy, function fetches a policy from the ledger");
                // const policy = await contract.submitTransaction("ReadPolicy", id);
                // console.log("*** Result: committed");

                return response.status(200).json({ policy: id });
            } catch (error) {
                return response.status(400).json({
                    message: `Failed to create policy`,
                    error
                });
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to create policy: ${error}`);
            return response.status(500).json({ message: error.message });
        }
    }

    async _getPolicies(request, response, next) {
        const { userID: org1UserId } = request.query;

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
        const { userID: org1UserId, id: policyID } = request.query;

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

    async _updatePolicy(request, response, next) {
        const { userID: org1UserId = "", creationDate = "", hasDataSubject = "", hasPersonalDataCategory = "", hasProcessing = "", hasPurpose = "", hasRecipient = "", hasStorage = { location: "", duration: "" } } = request.body;
        const { id } = request.params;

        console.log(`About to update an existing policy`);

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

                console.log("\n--> Submit Transaction: UpdatePolicy, function updates an existing policy from the ledger");
                const updatedPolicy = await contract.submitTransaction("UpdatePolicy", id, creationDate, hasDataSubject, hasPersonalDataCategory, hasProcessing, hasPurpose, hasRecipient, hasStorage.location, hasStorage.duration);
                console.log("*** Result: committed");

                console.log("\n--> Evaluate Transaction: ReadPolicy, function fetches a policy from the ledger");
                const policy = await contract.submitTransaction("ReadPolicy", id);
                console.log("*** Result: committed");

                return response.status(200).json({ policy: JSON.parse(policy) });
            } catch (error) {
                return response.status(400).json({
                    message: `Failed to update policy`,
                    error
                });
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to update policy: ${error}`);
            return response.status(500).json({ message: error.message });
        }
    }

    async _deletePolicy(request, response, next) {
        const { userID: org1UserId } = request.body;
        const { id: policyID } = request.params;

        console.log(`About to delete policy from the ledger`);

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

                console.log("\n--> Evaluate Transaction: DeletePolicy, function deletes a policy from the ledger");
                const policy = await contract.submitTransaction("DeletePolicy", policyID);
                console.log("*** Result: committed");

                return response.status(200).json({ message: "Policy deleted" });
            } catch (error) {
                return response.status(400).json({
                    message: `Failed to delete policy from the ledger`,
                    error
                });
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to delete policy from the ledger: ${error}`);
            return response.status(500).json({ message: error.message });
        }

    }

}

module.exports = LedgerController;


