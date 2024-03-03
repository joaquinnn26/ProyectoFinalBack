import { promises } from 'fs';
const path = require('path');
import { __dirname } from '../../../utils.js';
class UsersManagerFs {
    constructor(filePath) {
        this.filePath = filePath || path.join(__dirname, 'users.json');
    }

    async findUserByID(id) {
        const users = await this.readUsersFromFile();
        return users.find(user => user._id === id);
    }

    async findUserByEmail(email) {
        const users = await this.readUsersFromFile();
        return users.find(user => user.email === email);
    }

    async createUser(obj) {
        const users = await this.readUsersFromFile();
        const newUser = { ...obj, _id: users.length + 1 }; // Simula asignar un ID único
        users.push(newUser);
        await this.writeUsersToFile(users);
        return newUser;
    }

    async findUserByCart(cart) {
        const users = await this.readUsersFromFile();
        return users.find(user => user.cart === cart);
    }

    async readUsersFromFile() {
        try {
            const content = await promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            // Si el archivo no existe o hay un error al leerlo, devuelve un array vacío.
            return [];
        }
    }

    async writeUsersToFile(users) {
        await promises.writeFile(this.filePath, JSON.stringify(users, null, 2), 'utf-8');
    }
}

export const usersManagerFs=new UsersManagerFs("user.json")