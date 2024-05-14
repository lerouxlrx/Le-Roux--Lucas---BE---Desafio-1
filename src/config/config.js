const dotenv = require("dotenv");

dotenv.config({
    path: "./.env.desarrollo"
});

const configObject = {
    mongo_url: process.env.MONGO_URL,
    node_env: process.env.NODE_ENV || "development"
}

module.exports = configObject;