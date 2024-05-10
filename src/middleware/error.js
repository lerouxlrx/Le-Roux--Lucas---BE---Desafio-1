const { EErrors } = require("../services/error/enums.js");

const errorHandler = (error, req, res, next) => {
    console.log(error.name)
    switch(error.code) {
        case EErrors.Datos_Incompletos: 
        res.send({status: error.name, error: error.message});
        break;
        case EErrors.Producto_Existente: 
        res.send({status: error.name, error: error.message});
        break;
        case EErrors.BD_Error: 
        res.send({status: error.name, error: error.message});
        break;
        default: 
        res.send({status: "error", error: "Error desconocido"}); 
    }
}

module.exports = errorHandler;