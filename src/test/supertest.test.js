const supertest = require('supertest')

let expect;

before(async function () {
    const chai = await import('chai');
    expect = chai.expect;
});

const requester = supertest('http://localhost:8080')

describe ("Modulo de prueba de Teccomerce", () => {
    let createdProductId;
    let createdCartId;
    let createdUserId;
    let authToken;

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
    });
    describe("Testing de carritos: ", () => {
        it("Endpoint POST /api/carts debe crear un carrito", async () => {

            const { statusCode, ok, body } = await requester.post("/api/carts").send();

            expect(statusCode).to.equal(201);
            expect(body.cart).to.have.property("_id");
            createdCartId = body.cart._id;
        });

        it("Endpoint GET /api/carts debe obtener todos los carritos", async () => {
            const { statusCode, ok, body } = await requester.get("/api/carts");

            expect(statusCode).to.equal(200);
            expect(body).to.be.an('array');
        });

        it("Endpoint GET /api/carts/:cid debe obtener un carrito por ID", async () => {
            const { statusCode, ok, body } = await requester.get(`/api/carts/${createdCartId}`);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property("_id", createdCartId);
        });

        it("Endpoint PUT /api/carts/:cid debe actualizar un carrito por ID", async () => {
            const products = [
                {
                    "product": "65dbcd9b3aea5c5bdb009981",
                    "quantity": 6
                },
                {
                    "product": "65dbcd9b3aea5c5bdb009988",
                    "quantity": 3
                }
            ];

            const { statusCode, ok, body } = await requester.put(`/api/carts/${createdCartId}`).send(products);

            expect(statusCode).to.equal(201);
            expect(body).to.have.property("cartId", createdCartId);
        });

        it("Endpoint DELETE /api/carts/:cid debe eliminar todos los productos de un carrito por ID", async () => {
            const { statusCode, ok, body } = await requester.delete(`/api/carts/${createdCartId}`);

            expect(statusCode).to.equal(201);
            expect(body).to.have.property("cartId", createdCartId);
        });
    });
    describe("Testing de usuarios: ", () => {
        it("Endpoint POST /api/users/register debe registrar un usuario", async () => {
            const testUser = {
                first_name: "Greco",
                last_name: "Gato",
                email: "greco@gato.com",
                password: "1234",
                age: 0
            };

            const { statusCode, body } = await requester.post("/api/users/register").send(testUser);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property("token");
            authToken = body.token;
        });

        it("Endpoint POST /api/users/login debe autenticar un usuario", async () => {
            const loginUser = {
                email: "greco@gato.com",
                password: "1234"
            };

            const { statusCode, body } = await requester.post("/api/users/login").send(loginUser);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property("token");
            authToken = body.token;
        });

/*         it("Endpoint GET /api/users/profile debe obtener el perfil del usuario", async () => {
            const { statusCode, body } = await requester.get("/api/users/profile")
                .set('Authorization', `Bearer ${authToken}`);
            console.log(statusCode)
            console.log(body)
            expect(statusCode).to.equal(200);
            expect(body).to.have.property("first_name", "Greco");
            expect(body).to.have.property("last_name", "Gato");
        });

        it("Endpoint PUT /api/users/premium/:uid debe cambiar el rol del usuario a premium", async () => {
            const { statusCode, body } = await requester.put(`/api/users/premium/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property("role", "premium");
        });

        it("Endpoint POST /api/users/logout debe cerrar sesión del usuario", async () => {
            const { statusCode, body } = await requester.post("/api/users/logout")
                .set('Authorization', `Bearer ${authToken}`);

            expect(statusCode).to.equal(200);
        }); */
    });
});
