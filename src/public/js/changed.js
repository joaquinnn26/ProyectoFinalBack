document.addEventListener('DOMContentLoaded', function() {
    const buttonsChange = document.querySelectorAll('.button_change');

    buttonsChange.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();


            const idUser = button.getAttribute('data-user-id');
            console.log("id del user",idUser)
            console.log("entro al evento")
            changeRole(idUser);
        });
    });
});