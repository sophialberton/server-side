// src/controllers/associados.controllers.js

// 💡 CORREÇÃO AQUI: Importa o Service com o nome correto: 'associados.services'
const associadoService = require('../service/associados.services');

// Função auxiliar para tratamento de erros
const handleError = (res, error, defaultMessage, defaultStatus = 400) => {
    const status = error.status || defaultStatus;
    const message = error.message || defaultMessage;
    res.status(status).json({ error: message });
};


// --- Operações CRUD + Busca por CPF ---

// [POST] /api/associados - Cria um novo associado
const createAssociado = async (req, res) => {
    try {
        const novoAssociado = await associadoService.criarAssociado(req.body);
        // Status 201: Created
        res.status(201).json(novoAssociado);
    } catch (error) {
        // Tratamento de exceção: erro de validação ou CPF duplicado (400)
        handleError(res, error, 'Erro ao criar associado.');
    }
};

// [GET] /api/associados - Lista todos os associados
const findAllAssociados = async (req, res) => {
    try {
        const associados = await associadoService.buscarTodosAssociados();
        res.status(200).json(associados);
    } catch (error) {
        // Tratamento de exceção: erro no servidor ou na camada de dados (500)
        handleError(res, error, 'Erro ao buscar associados.', 500);
    }
};

// [GET] /api/associados/cpf/:cpf - Busca um associado por CPF (Endpoint Adicional)
const findByCpf = async (req, res) => {
    try {
        const { cpf } = req.params;
        const associado = await associadoService.buscarAssociadoPorCpf(cpf);
        res.status(200).json(associado);
    } catch (error) {
        // Tratamento de exceção: 404 Not Found (definido no Service) ou 400
        handleError(res, error, 'Erro ao buscar associado por CPF.');
    }
};

// [PUT] /api/associados/:cpf - Atualiza um associado por CPF
const updateAssociado = async (req, res) => {
    try {
        const { cpf } = req.params;
        const associadoAtualizado = await associadoService.atualizarAssociado(cpf, req.body);
        res.status(200).json(associadoAtualizado);
    } catch (error) {
        // Tratamento de exceção: 404 Not Found ou erro de validação (400)
        handleError(res, error, 'Erro ao atualizar associado.');
    }
};

// [DELETE] /api/associados/:cpf - Deleta um associado por CPF
const deleteAssociado = async (req, res) => {
    try {
        const { cpf } = req.params;
        await associadoService.deletarAssociado(cpf);
        // Status 204: No Content (sucesso sem corpo de resposta)
        res.status(204).send(); 
    } catch (error) {
        // Tratamento de exceção: 404 Not Found 
        handleError(res, error, 'Erro ao deletar associado.');
    }
};

module.exports = {
    createAssociado,
    findAllAssociados,
    findByCpf, // Endpoint adicional solicitado
    updateAssociado,
    deleteAssociado,
};