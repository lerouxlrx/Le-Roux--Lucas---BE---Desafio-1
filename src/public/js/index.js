/* console.log('Estoy funcionando, JS desde Public.') */

//Conectar socket
const socket = io();
//Reco productos
socket.on("productos", (data) => {
    console.log(data)
    renderizarProductos(data)
});

//Funciones
    //Renderizado productos
const renderizarProductos = (productos) => {
    const seccionProductos = document.getElementById("seccionProductos");
    seccionProductos.innerHTML = "";

    productos.forEach(item => {
        const contenedorProducto = document.createElement("article");
        contenedorProducto.classList.add("contenedorProducto");

        contenedorProducto.innerHTML = `
        <h4 class="categoria">${item.category}</h4>        
        <h2 class="titulo">${item.title}   -   ${item.code}</h2>
        <h3 class="precio">Precio:${item.price}</h3>
        <img  class="imagen" src="${item.thumbnails}" alt="Imagen">
        <h5 class="descripcion">Descripción: ${item.description}</h5>
        <button>Eliminar</button>
        `;

        seccionProductos.appendChild(contenedorProducto)

            //Eliminar
        contenedorProducto.querySelector("button").addEventListener("click", ()=> {
            eliminarProducto(item.id)
        })
    })
}

    //Eliminar producto
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id)
}

    //Agregar producto
document.getElementById('btnEnviar').addEventListener("click", () =>{
    agregarProducto()
})

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnails: document.getElementById("thumbnails").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
    }

    socket.emit("agregarProducto", producto)
}