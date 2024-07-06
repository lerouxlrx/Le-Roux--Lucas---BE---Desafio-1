const socket = io(); 
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("products", (data) => {
    renderProducts(data);
})

const renderProducts = (products) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = ` 
            <p> ${item.title} </p>
            <p> ${item.price} </p>
            <button> Eliminar </button>
        `;

        productsContainer.appendChild(card);
        card.querySelector("button").addEventListener("click", ()=> {
            if (role === "premium" && item.owner === email) {
                deleteProduct(item._id);
            } else if (role === "admin") {
                deleteProduct(item._id);
            } else {
                Swal.fire({
                    title: "Acceso denegado",
                    text: "No podes eliminar un producto que no sea tuyo.",
                })
            }
        })
    })
}

const deleteProduct = (id) =>  {
    socket.emit("deleteProduct", { id, role });
}

document.getElementById("btnEnviar").addEventListener("click", () => {
    createProduct(role,email);
})

const createProduct = (role, email) => {

    const owner = role === "premium" ? email : "admin";

    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnails: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    };

    socket.emit("createProduct", product);
}