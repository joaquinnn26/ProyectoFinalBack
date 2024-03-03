const buttonAdd = document.querySelector('#button_addToCart');

buttonAdd.addEventListener('click', function (e) {
    e.preventDefault();

    const productId = buttonAdd.getAttribute('data-product-id');
    const cartId = buttonAdd.getAttribute('data-cart-id');
    console.log("anda el evento")
    addToCart(cartId, productId);
});
