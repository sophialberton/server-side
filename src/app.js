const express = require('express');
const bodyParser = require('body-parser');

const rotasAssociados = require('./routes/associados.routes'); 

const app = express();

// Middleware: Permite que o Express leia JSON
app.use(bodyParser.json());

// Rota principal
app.get('/', (req, res) => {
    res.status(200).send({
        mensagem: 'API CRUD de Associados está online!',
        pontosDeAcesso: [
            '/api/associados (GET, POST, PUT, DELETE)',
            '/api/associados/cpf/:cpf (GET - Busca por CPF)',
            '/api/associados/:cpf (GET, PUT, DELETE)'
        ]
    });
});

// Adiciona as rotas no prefixo /api
app.use('/api', rotasAssociados);

// Middleware de tratamento de erro genérico
app.use((erro, req, res, next) => {
    console.error(erro.stack);
    res.status(500).send({ mensagem: 'Erro interno do servidor.' });
});

module.exports = app;