const {faker} = require("@faker-js/faker");

const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(), 
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: parseInt(faker.string.numeric()),
        code: faker.commerce.isbn(10),
        status: faker.datatype.boolean(),
        category: faker.commerce.department() 
    }
}

module.exports = generateProducts; 