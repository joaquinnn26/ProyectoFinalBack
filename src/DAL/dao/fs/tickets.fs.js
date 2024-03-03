import { promises } from 'fs';

import { __dirname } from '../../../utils.js';
const path = require('path');

class TicketsFs {
    constructor(filePath) {
        this.filePath = filePath || path.join(__dirname, 'tickets.json');
    }

    async createTicket(ticket) {
        const tickets = await this.readTicketsFromFile();
        const response = { ...ticket, _id: tickets.length + 1 }; // Asigna un ID único (simulado)
        tickets.push(response);
        await this.writeTicketsToFile(tickets);
        return response;
    }

    async readTicketsFromFile() {
        try {
            const content = await promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            // Si el archivo no existe o hay un error al leerlo, devuelve un array vacío.
            return [];
        }
    }

    async writeTicketsToFile(tickets) {
        await promises.writeFile(this.filePath, JSON.stringify(tickets, null, 2), 'utf-8');
    }
}

export const ticketManagerFs=new TicketsFs("tickets.json")