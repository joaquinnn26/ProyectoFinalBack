
const path = require('path');
import { promises } from 'fs';
import { __dirname } from '../../../utils.js';

    class MessagesManagerFs {
        constructor(filePath) {
            this.filePath = filePath || path.join(__dirname, 'messages.json');
        }
    
        async findAll() {
            const result = await this.readMessagesFromFile();
            return result;
        }
    
        async createOne(obj) {
            const messages = await this.readMessagesFromFile();
            messages.push(obj);
            await this.writeMessagesToFile(messages);
            return obj;
        }
    
        async readMessagesFromFile() {
            try {
                const content = await promises.readFile(this.filePath, 'utf-8');
                return JSON.parse(content);
            } catch (error) {
                
                return [];
            }
        }
    
        async writeMessagesToFile(messages) {
            await promises.writeFile(this.filePath, JSON.stringify(messages, null, 2), 'utf-8');
        }
    }

    export const managerMessageFs=new managerMessageFs('messages.json')