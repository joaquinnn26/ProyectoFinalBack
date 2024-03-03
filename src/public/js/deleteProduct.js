document.addEventListener('DOMContentLoaded', function() {
    const buttonsDelete = document.querySelectorAll('.button_delete');

    buttonsDelete.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            console.log("Button clicked! User ID:", button.getAttribute('data-user-id'));

            const idUser = button.getAttribute('data-user-id');
            console.log("id del user",idUser)
            console.log("entro al evento")
            deleteUser(idUser);
        });
    });
});
