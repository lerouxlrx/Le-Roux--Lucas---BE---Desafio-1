function deleteUser(userId) {
    console.log("ID:" + userId)
    fetch(`/api/users/delete/${userId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al intentar eliminar usuario');
            }
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteInactiveUsers() {
    fetch('/api/users/delete', {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al intentar eliminar usuarios inactivos');
        }
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

