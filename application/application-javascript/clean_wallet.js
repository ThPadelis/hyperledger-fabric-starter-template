const rimraf = require('rimraf');
const path = require("path");

const walletPath = path.join(__dirname, "src", "wallet");

rimraf(walletPath, { disableGlob: true }, (error) => {
    if (error) {
        console.error("Failed to remove wallet");
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log("Wallet removed");
    }
});