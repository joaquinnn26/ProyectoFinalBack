
import { faker } from "@faker-js/faker";


//generador de productos con facker
export function generateMockProducts(quantity) {
    const products = [];
  
    for (let i = 0; i < quantity; i++) {
        const product = {
            
            status:faker.datatype.boolean(2),
            code: faker.string.alphanumeric(),
            stock: faker.number.int(100),
            category:faker.commerce.department(),
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.lorem.sentence(),
  
        };
        products.push(product);
    }
  
    return products;
  }
  