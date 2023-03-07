const admin = require("firebase-admin");
const serviceAccount = require("../../../pushNotification.json");
const config = require("config");
const { model } = require("mongoose");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    database: config.get("db")
})

module.exports.admin = admin;

export {};