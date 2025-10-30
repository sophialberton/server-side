const dadosAssociado = require('../data/associado.data');

// --- Validação ---

const validarAssociado = (associado, ehCriacao = true) => {
    const { cpf_associado, nome_associado, email_associado } = associado;

    // 1. CPF (Obrigatório APENAS na criação)
    if (ehCriacao && !cpf_associado) {
        throw new Error('CPF do associado é obrigatório.');
    }
    
    // 2. Nome: Valida se é criação OU se o campo 'nome_associado' está presente (existe)
    if (ehCriacao || nome_associado !== undefined) {
        if (!nome_associado || nome_associado.trim() === '') {
            throw new Error('Nome do associado é obrigatório.');
        }
    }

    // 3. Email: Valida se é criação OU se o campo 'email_associado' está presente (existe)
    if (ehCriacao || email_associado !== undefined) {
        if (!email_associado || !email_associado.includes('@')) {
            throw new Error('Email do associado é inválido.');
        }
    }
};

// --- Funções de Serviço ---

const criarAssociado = async (associado) => {
    validarAssociado(associado);
    return await dadosAssociado.criar(associado);
};

const buscarTodosAssociados = async () => {
    return await dadosAssociado.buscarTodos();
};

const buscarAssociadoPorCpf = async (cpf) => {
    if (!cpf) {
        throw new Error('CPF para busca é obrigatório.');
    }
    const associado = await dadosAssociado.buscarPorCpf(cpf);
    if (!associado) {
        // Prepara erro 404 para o Controller
        const erroNaoEncontrado = new Error('Associado não encontrado.');
        erroNaoEncontrado.status = 404; 
        throw erroNaoEncontrado;
    }
    return associado;
};

const atualizarAssociado = async (cpf, dados) => {
    if (!cpf) {
        throw new Error('CPF para atualização é obrigatório.');
    }
    validarAssociado(dados, false); // Validação mais flexível na atualização
    
    const associadoAtualizado = await dadosAssociado.atualizar(cpf, dados);
    
    if (!associadoAtualizado) {
        // Prepara erro 404 para o Controller
        const erroNaoEncontrado = new Error('Associado não encontrado para atualização.');
        erroNaoEncontrado.status = 404;
        throw erroNaoEncontrado;
    }
    return associadoAtualizado;
};

const deletarAssociado = async (cpf) => {
    if (!cpf) {
        throw new Error('CPF para deleção é obrigatório.');
    }
    const foiDeletado = await dadosAssociado.remover(cpf);
    
    if (!foiDeletado) {
        // Prepara erro 404 para o Controller
        const erroNaoEncontrado = new Error('Associado não encontrado para deleção.');
        erroNaoEncontrado.status = 404;
        throw erroNaoEncontrado;
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