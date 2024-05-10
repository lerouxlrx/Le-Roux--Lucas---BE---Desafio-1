class CustomError {
    static createError({name = "Error", cause = "Desconocido", message, code = 999}){
        const error = new Error(message); 
        error.name = name;
        error.cause = cause;
        error.code = code;
        throw error; 
    }
}

module.exports = CustomError; 