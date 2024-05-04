function deleteProduct(cartId, productId) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito');
            }
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function emptyCart(cartId) {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al vaciar el carrito');
            }
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function buyCart(cartId) {
    fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST'
    })
        .catch(error => {
            console.error('Error:', error);
        });
}