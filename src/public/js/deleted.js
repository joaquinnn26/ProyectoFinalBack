function deleteUser(idUser){
    fetch(`api/users/deleteUserById/${idUser}`,{
        method: 'DELETE',
        headers:{
            "content-type":"application/json"
        }
    }).then(result => {
        if (result.status === 200) {
            console.log("entro a futnciin 200"),
            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Usuario eliminado",
                timer: 5000,
                showConfirmButton: false
            });
        } else {
            console.log("Error al eliminar el usuario. Status code:", result.status);
            throw new Error(`Error al eliminar el usuario. Status code: ${result.status}`);
        }
    }).catch(error => {
        console.log("entro a futnciin errorr",error.message),
        Swal.fire({
            
            toast: true,
            position: "top-right",
            text: "Error: " + error.message,
            timer: 5000,
            showConfirmButton: false
        });

        console.log(error.message);
    });
}