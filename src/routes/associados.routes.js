// src/routes/associados.routes.js

const express = require('express');
// 💡 CORREÇÃO APLICADA: Importa o arquivo CONTROLLER com o nome correto: 'associados.controllers'
const associadoController = require('../controllers/associados.controllers'); 

const router = express.Router();

// Rotas CRUD
router.post('/associados', associadoController.createAssociado);       // CREATE
router.get('/associados', associadoController.findAllAssociados);      // READ ALL

// Endpoint de busca por CPF (usando o parâmetro na URL)
router.get('/associados/cpf/:cpf', associadoController.findByCpf);     // READ ONE (Por CPF)

// Rotas que usam o CPF como identificador
router.get('/associados/:cpf', associadoController.findByCpf);         // READ ONE 
router.put('/associados/:cpf', associadoController.updateAssociado);     // UPDATE
router.delete('/associados/:cpf', associadoController.deleteAssociado); // DELETE

module.exports = router;