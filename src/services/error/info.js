const errorInformation = (product) => {
    return ` Los datos estan incompletos o son invalidos. 
        Necesitamos: 
        - Title: String, recibimos ${product.title}
        - Description: String, recibimos ${product.description}
        - Price: Number, recibimos ${product.price}
        - Code: String, rebicimos ${product.code}
        - Stock: Number, rebicimos ${product.stock}
        - Category: String, rebicimos ${product.category}
    `;
}

const errorExisting = (product) => {
    return ` El producto ya existe o estas intentando usar un código que ya esta ocupado. El codigo debe ser único. Enviaste el código: ${product.code}
    `;
}

module.exports = {
    errorInformation,
    errorExisting
}