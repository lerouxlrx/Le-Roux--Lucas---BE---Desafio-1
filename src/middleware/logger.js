const { developmentLogger, productionLogger } = require("../utils/logger");
const { node_env } = require("../config/config");

const addLogger = (req, res, next) => {
    req.logger = node_env === "production" ? productionLogger : developmentLogger;
    req.logger.http(`Respuesta de URL ${req.url}, metodo ${req.method} - ${new Date().toLocaleTimeString()}`);
    next();
}

module.exports = addLogger;