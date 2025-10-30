// src/service/associados.services.js

// 💡 CORREÇÃO AQUI: Importa o Data com o nome correto: 'associado.data'
const associadoData = require('../data/associado.data');

// --- Funções de Validação ---

const validateAssociado = (associado, isCreation = true) => {
    const { cpf_associado, nome_associado, email_associado } = associado;

    if (isCreation && !cpf_associado) {
        throw new Error('CPF do associado é obrigatório.');
    }
    if (!nome_associado || nome_associado.trim() === '') {
        throw new Error('Nome do associado é obrigatório.');
    }
    if (!email_associado || !email_associado.includes('@')) {
        throw new Error('Email do associado é inválido.');
    }
    // Lógica mais complexa de validação de CPF ou email único iria aqui
};

// --- Funções de Serviço ---

const criarAssociado = async (associado) => {
    validateAssociado(associado);
    return await associadoData.create(associado);
};

const buscarTodosAssociados = async () => {
    return await associadoData.findAll();
};

const buscarAssociadoPorCpf = async (cpf) => {
    if (!cpf) {
        throw new Error('CPF para busca é obrigatório.');
    }
    const associado = await associadoData.findByCpf(cpf);
    if (!associado) {
        // Lançar um erro específico para facilitar o tratamento no controller
        const notFoundError = new Error('Associado não encontrado.');
        notFoundError.status = 404; 
        throw notFoundError;
    }
    return associado;
};

const atualizarAssociado = async (cpf, dados) => {
    if (!cpf) {
        throw new Error('CPF para atualização é obrigatório.');
    }
    // A validação de atualização pode ser mais flexível
    validateAssociado(dados, false); 
    
    const associadoAtualizado = await associadoData.update(cpf, dados);
    
    if (!associadoAtualizado) {
        const notFoundError = new Error('Associado não encontrado para atualização.');
        notFoundError.status = 404;
        throw notFoundError;
    }
    return associadoAtualizado;
};

const deletarAssociado = async (cpf) => {
    if (!cpf) {
        throw new Error('CPF para deleção é obrigatório.');
    }
    const deletado = await associadoData.remove(cpf);
    
    if (!deletado) {
        const notFoundError = new Error('Associado não encontrado para deleção.');
        notFoundError.status = 404;
        throw notFoundError;
    }
    return true;
};

module.exports = {
    criarAssociado,
    buscarTodosAssociados,
    buscarAssociadoPorCpf,
    atualizarAssociado,
    deletarAssociado,
};