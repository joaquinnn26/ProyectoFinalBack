const buttonAdd = document.querySelector('#button_addToCart');

buttonAdd.addEventListener('click', function (e) {
    e.preventDefault();

    const pid = buttonAdd.getAttribute('data-product-id');
    const cid = buttonAdd.getAttribute('data-cart-id');
    console.log("cartid",cid)
    console.log("produicid",pid)
    console.log("anda el evento")
    addToCart(cid, pid);
});
function addToCart(cid, pid) {
    fetch(`/api/cart/${cid}/products/${pid}`, {
        
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            //"Authorization": `Bearer ${token}`
        },
    }) .then(result => {
        if (result.status === 200) {
            return result.json().then(data => {
                
                // Resto de tu código ...
                const productAdded=data.payload
                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: `Se agregó el producto ${productAdded.title} al carrito`,
                    timer: 5000,
                    showConfirmButton: false
                });
            });
        } else {
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
