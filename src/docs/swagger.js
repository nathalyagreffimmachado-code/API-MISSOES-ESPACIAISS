const swaggerJsdoc = require('swagger-jsdoc');

 
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST de Missoes Espaciais',
            version: '1.0.0',
            description: 'Documentacao da API de Misssoes Espaciais'
        },
        servers:[
            {
                url: 'http://localhost:3000',
            },
        ],
    },
     apis: ['./src/router/*.js'],
};
 
export default swaggerJsdoc(opcoes);