// src/routes/associado.routes.js

const express = require('express');
const associadoController = require('../controllers/associado.controller');

const router = express.Router();

// Rotas CRUD
router.post('/associados', associadoController.createAssociado);       // CREATE
router.get('/associados', associadoController.findAllAssociados);      // READ ALL

// Endpoint de busca por CPF (usando o parâmetro na URL)
router.get('/associados/cpf/:cpf', associadoController.findByCpf);     // READ ONE (Por CPF)

// Rotas que usam o CPF como identificador
router.get('/associados/:cpf', associadoController.findByCpf);         // READ ONE (também pode ser usado assim)
router.put('/associados/:cpf', associadoController.updateAssociado);     // UPDATE
router.delete('/associados/:cpf', associadoController.deleteAssociado); // DELETE

module.exports = router;