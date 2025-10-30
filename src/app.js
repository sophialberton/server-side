// src/app.js

const express = require('express');
const bodyParser = require('body-parser');
const associadoRoutes = require('./routes/associado.routes');

const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(bodyParser.json());

// Rota principal
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'API CRUD de Associados está online!',
    endpoints: [
      '/api/associados (GET, POST, PUT, DELETE)',
      '/api/associados/cpf/:cpf (GET - Busca por CPF)',
      '/api/associados/:cpf (GET, PUT, DELETE)'
    ]
  });
});

// Adiciona as rotas de associados
app.use('/api', associadoRoutes);

// Middleware de tratamento de erro genérico (boa prática)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Algo deu errado!' });
});

module.exports = app;