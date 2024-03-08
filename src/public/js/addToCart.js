//const token=document.cookie.split(';').find(cookie => cookie.trim().startsWith('jwt_token=')).split('=')[1];
function addToCart(cid, pid) {
    fetch(`/api/cart/${cid}/products/${pid}`, {
        
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            //"Authorization": `Bearer ${token}`
        },
    }).then(result => {
        if (result.status === 200) {
            //console.log("entro a futnciin"),
            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Se agregó el producto al carrito",
                timer: 5000,
                showConfirmButton: false
            });
        } else {
            //console.log("entro a futnciin")
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    }).catch(error => {
        //console.log("entro a futnciin"),
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