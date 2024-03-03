function changeRole(idUser) {
    fetch(`/api/users/premium/${idUser}`, {
        
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
    }).then(result => {
        if (result.status === 200) {
            console.log("entro a futnciin"),
            Swal.fire({
                toast: true,
                position: "top-right",
                text: `Se cambio el rol al usuario con id: ${idUser}`,
                timer: 5000,
                showConfirmButton: false
            });
        } else {
            console.log("entro a futnciin")
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    }).catch(error => {
        console.log("entro a futnciin"),
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