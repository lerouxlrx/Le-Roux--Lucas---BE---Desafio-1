const winston = require("winston");

const levels = {
    level: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "blue",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

const developmentLogger = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine( 
                winston.format.colorize({colors: levels.colors}),
                winston.format.simple()
            )
        })
    ]
})

const productionLogger = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine( 
                winston.format.colorize({colors: levels.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "error", 
            format: winston.format.simple()
        })
    ]
})

module.exports = {
    developmentLogger,
    productionLogger
}