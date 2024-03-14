
let users = [];

document.addEventListener('DOMContentLoaded', getUserList);

function getUserList() {
    fetch(`/api/users/getUsers`, {
        method: 'GET',
    }).then(result => {
        if (result.status === 200) {
            return result.json().then(data => {
                
                users = data.payload;
                showUserList(users);
            });
        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    }).catch(error => error.message,
            );
    
}

function showUserList(users) {
    const usersDiv = document.getElementById("div-users");
    usersDiv.innerHTML = ''; // Limpiar el contenido previo

    users.forEach((user) => {
        const userInfo = document.createElement("div");
        userInfo.innerHTML = `
            <br>
            <p>Email: ${user.email}</p>
            <p>Role: ${user.role}</p>
            <p>ID: ${user._id}</p>
            <button onclick="updateRole('${user._id}')">Update role</button>
            <button onclick="deleteU('${user._id}')">Delete user</button>
            <br>
            <br>
        `;
        usersDiv.appendChild(userInfo);
    });
}




function updateRole(uid) {    
    fetch(`/api/users/premium/${uid}`, {
        method: 'POST',
    }).then(result => {

        if (result.status === 200) {
            return result.json().then(data => {
                const updatedUser = data.payload                
                /* let newusers = users.map(user => (user._id === uid ? updatedUser : user)) */
                let newusers = users.map(user => {
                    if (user._id === uid) {
                        return updatedUser;
                    } else {
                        return user;
                    }
                });

                showUserList(newusers)

                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: "User role has changed",
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
        .catch(error => {
            console.error("error del post",error)
            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Users must upload their information to change to Premium user" + error.message,
                timer: 5000,
                showConfirmButton: false
            });

        })
}



function deleteU(idUser) {
    fetch(`/api/users/deleteUserById/${idUser}`, {
        method: 'DELETE',
    }).then(result => {

        if (result.status === 200) {

            return result.json().then(data => {

                const deletedUser = data.payload
                
                let newUsers = users.filter(user => deletedUser._id !== user._id)

                showUserList(newUsers)

                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: `${deletedUser.email} was deleted`,
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


