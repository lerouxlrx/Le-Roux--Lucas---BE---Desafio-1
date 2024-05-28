const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de la App Teccomerce",
            description: "E-commerce de ultima tecnologia en conexiones de electricidad."
        }
    },
    apis: ["./src/docs/**/*.yaml"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;