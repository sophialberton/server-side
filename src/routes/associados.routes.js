const express = require('express');
const controleAssociados = require('../controllers/associados.controllers'); 

const roteador = express.Router();

// Rotas CRUD
roteador.post('/associados', controleAssociados.criarAssociado);        // POST: Cria
roteador.get('/associados', controleAssociados.buscarTodosAssociados);   // GET: Lista todos

// Rotas de Busca, Atualização e Deleção por CPF
roteador.get('/associados/cpf/:cpf', controleAssociados.buscarPorCpf);    // GET: Busca por CPF (adicional)
roteador.get('/associados/:cpf', controleAssociados.buscarPorCpf);        // GET: Busca por CPF
roteador.put('/associados/:cpf', controleAssociados.atualizarAssociado);  // PUT: Atualiza por CPF
roteador.delete('/associados/:cpf', controleAssociados.deletarAssociado); // DELETE: Deleta por CPF

module.exports = roteador;