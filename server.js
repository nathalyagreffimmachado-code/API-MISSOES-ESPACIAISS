import express from 'express';
import {getApod} from './src/services/nasa.service.js';
 
const app = express();
app.use(express.json());
 
app.get('/apod', async (req,res) => {
    try {
        const dados = await getApod(req,query.date);
        res.json(dados);
    }catch (error) {
        res.status(error.status || 500).json(error);
    }
});
 
app.listen(3000, () => console.log ('Servidor rodando na porta  3000'));
 