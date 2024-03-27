import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { registerApiRoutes } from './src/routes/apiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota básica para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo ao backend!' });
});

// Registro das rotas da API
registerApiRoutes(app);

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
