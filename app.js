const express = require('espress');
const missoesRouter = require('./src/router/missoes.router');
const setupSwagger = require('./src/docs/swagger');
 
 
const app = express();
app.use(express.json());
 
setupSwagger(app);
app.use('/', missoesRouter);
app.use((req, res => {
    res.status(404).json({erro: "Not Found", mensagem: "Rota nao encontrado"})
}))
export default app;