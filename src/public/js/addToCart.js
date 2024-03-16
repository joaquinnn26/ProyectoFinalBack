
let products = [];
let totalPurchase;
let cid
/* const buttonModal = document.getElementById("openModalBtn");
//const cid = buttonModal.getAttribute('data-user-cart');
const buttonAdd = document.querySelector('#button_addToCart');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0]; */

document.addEventListener('DOMContentLoaded', function () {
    const buttonModal = document.getElementById("openModalBtn");
    const buttonAdd = document.querySelector('#button_addToCart');
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];
    cid = buttonModal.getAttribute('data-user-cart');
    buttonModal.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = "block";
        getProductsList();
    });

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    buttonAdd.addEventListener('click', function (e) {
        e.preventDefault();
        const pid = buttonAdd.getAttribute('data-product-id');
        addToCart(cid, pid);
    });

    
    
});

function getProductsList() {
    fetch(`/api/cart/${cid}`, {
        method: 'GET',
    }).then(result => {
        if (result.status === 200) {
            return result.json().then(data => {

                products = data.payload;
                showProductList(products);
            });
        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    }).catch(error => error.message,
            );
    
}

function showProductList(products) {
    const productsDiv = document.getElementById("products-container");
    const productTotal=document.getElementById("total-container")
    productTotal.innerHTML='';
    productsDiv.innerHTML = ''; // Limpiar el contenido previo
    let total= 0
    products.forEach((product) => {
        const stock=product.product.stock
        let sumar=product.quantity +1
        let restar=product.quantity -1
        total += product.product.price* product.quantity
        //let subtotal = product.product.price * product.quantity
        const productInfo = document.createElement("div");
        productInfo.innerHTML = `
            <br>
            <p>Title: ${product.product.title}</p>
            <pDescription: ${product.product.description}</p>
            <p>Price: $${product.product.price}</p>
            <div>
            <p>Quantity: ${product.quantity} </p>
            <button class="buttonMas" onclick="changeQuantity('${product.product._id}',${sumar})">+</button>
            <button class="buttonMenos" onclick="changeQuantity('${product.product._id}',${restar})">-</button>
            </div>
            <p>Category: ${product.product.category}</p> 
            
            <p>Id: ${product.product._id}</p>      
            <button  onclick="deleteP('${cid}','${product.product._id}')">Delete</button>
            <br>
            <br>
        `;
        productsDiv.appendChild(productInfo);
        
        const substractQuantityButton = productInfo.querySelector('.buttonMenos');

       if (product.quantity===1) {
            substractQuantityButton.disabled = true;
        } else {
            substractQuantityButton.disabled = false;
        }

        const addQuantityButton = productInfo.querySelector('.buttonMas');
    if (product.quantity >= product.product.stock) {
            addQuantityButton.disabled = true;
        } else {
            addQuantityButton.disabled = false;
        }
        
    });
    
    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `
            <p>Total:$ ${total}</p>
            <button><a href="/cart/${cid}">COMPRAR</a></button>
        `;
        productTotal.appendChild(totalDiv);
   // sumTotalCart()
}





function changeQuantity(pid,quantityProd){

    const quantityUpdate={
        quantity:quantityProd
    }
    fetch(`/api/cart/${cid}/products/${pid}`,{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(quantityUpdate),
    }).then(result=>{
        if(result.status=== 200){
            return result.json().then(data => {
                cart=data.payload
                getProductsList()
                }
            )
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error.message);
    });
}


  function deleteP(cid, pid) {
    fetch(`/api/cart/${cid}/products/${pid}`, {
        method: 'DELETE',
    }).then(result => {

        if (result.status === 200) {

            return result.json().then(data => {

                const deletedProduct = data.payload
                
                let newProductList = products.filter(product => deletedProduct !== product.product._id)

                showProductList(newProductList)

                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: `Product deleted`,
                    timer: 5000,
                    showConfirmButton: false
                });
            });

        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    })
        .catch(error => { error.message;

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "User coudnt be deleted",
                timer: 5000,
                showConfirmButton: false
            });

        })
}
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
       
        Swal.fire({
            
            toast: true,
            position: "top-right",
            text: "Error: " + error.message,
            timer: 5000,
            showConfirmButton: false
        });

        
    });
}
