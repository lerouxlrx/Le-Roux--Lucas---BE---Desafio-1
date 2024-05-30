const supertest = require('supertest')

let expect;

before(async function () {
    const chai = await import('chai');
    expect = chai.expect;
});

const requester = supertest('http://localhost:8080')

describe ("Modulo de prueba de Teccomerce", () => {
    let createdProductId;

    describe ("Testing de productos: ", () => {
        it("Endpoint POST /api/products debe crear un producto", async () => {
            const testProduct = {
                title: "UPS con USB",
                description: "UPS 4 enchufes con 4 de USB",
                price: 5000,
                thumbnails: "https://http2.mlstatic.com/D_NQ_NP_731133-MLU72570699196_112023-O.webp",
                code: 1111111111,
                stock: 500,
                category: "UPS",
                status: true,
                owner: "admin"
            }

            const {statusCode, ok, body} = await requester.post("/api/products").send(testProduct);

            expect(body).to.have.property("_id");
            createdProductId = body._id;
        })
        it("Endpoint GET /api/products debe obtener todos los productos", async () => {
            const {statusCode, ok, body} = await requester.get("/api/products");

            expect(statusCode).to.equal(200);
            expect(body).to.be.an('array');
        });

        it("Endpoint GET /api/products/:pid debe obtener un producto por ID", async () => {
            const {statusCode, ok, body} = await requester.get(`/api/products/${createdProductId}`);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property("_id", createdProductId);
        });
        it("Endpoint PUT /api/products/:pid debe actualizar un producto por ID", async () => {
            const updateProduct = {
                title: "UPS con USB actualizado",
                price: 5500
            };

            const {statusCode, ok, body} = await requester.put(`/api/products/${createdProductId}`).send(updateProduct);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property("message", "Se actualizó el producto.");
        });

        it("Endpoint DELETE /api/products/:pid debe eliminar un producto por ID", async () => {
            const {statusCode, ok, body} = await requester.delete(`/api/products/${createdProductId}`);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property("_id", createdProductId);
        });
    })
})
