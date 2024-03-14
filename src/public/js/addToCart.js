
let products = [];
let totalPurchase;

const cartTitle = document.getElementById("cart-title");
const cid = cartTitle.getAttribute('data-user-cart');

document.addEventListener('DOMContentLoaded', getProductsList);

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
        total += product.product.price* product.quantity
        //let subtotal = product.product.price * product.quantity
        const productInfo = document.createElement("div");
        productInfo.innerHTML = `
            <br>
            <p>Title: ${product.product.title}</p>
            <pDescription: ${product.product.description}</p>
            <p>Price: $${product.product.price}</p>

            <p>Quantity: ${product.quantity}</p>

            <p>Category: ${product.product.category}</p> 
            
            <p>Id: ${product.product._id}</p>      
            <button onclick="deleteP('${cid}','${product.product._id}')">Delete</button>
            <br>
            <br>
        `;
        productsDiv.appendChild(productInfo);
    });
    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `
            <p>Total:$ ${total}</p>
        `;
        productTotal.appendChild(totalDiv);
   // sumTotalCart()
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