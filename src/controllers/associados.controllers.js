const servicoAssociados = require('../service/associados.services');

// Função auxiliar para tratamento e padronização de erros
const tratarErro = (res, erro, mensagemPadrao, statusPadrao = 400) => {
    const status = erro.status || statusPadrao;
    const mensagem = erro.message || mensagemPadrao;
    res.status(status).json({ erro: mensagem });
};


// --- Funções de Controle (Recebe req, Chama Service, Envia res) ---

// [POST] /api/associados: Cria um novo associado
const criarAssociado = async (req, res) => {
    try {
        const novoAssociado = await servicoAssociados.criarAssociado(req.body);
        // 201 Created
        res.status(201).json(novoAssociado);
    } catch (erro) {
        // 400 Bad Request (Validação/Duplicidade)
        tratarErro(res, erro, 'Erro ao criar associado.');
    }
};

// [GET] /api/associados: Lista todos os associados
const buscarTodosAssociados = async (req, res) => {
    try {
        const associados = await servicoAssociados.buscarTodosAssociados();
        res.status(200).json(associados);
    } catch (erro) {
        // 500 Internal Server Error (Erro de servidor/dados)
        tratarErro(res, erro, 'Erro ao buscar associados.', 500);
    }
};

// [GET] /api/associados/:cpf ou /api/associados/cpf/:cpf: Busca por CPF
const buscarPorCpf = async (req, res) => {
    try {
        const { cpf } = req.params;
        const associado = await servicoAssociados.buscarAssociadoPorCpf(cpf);
        res.status(200).json(associado);
    } catch (erro) {
        // 404 Not Found (Se não encontrar) ou 400 (CPF inválido)
        tratarErro(res, erro, 'Erro ao buscar associado por CPF.');
    }
};

// [PUT] /api/associados/:cpf: Atualiza por CPF
const atualizarAssociado = async (req, res) => {
    try {
        const { cpf } = req.params;
        const associadoAtualizado = await servicoAssociados.atualizarAssociado(cpf, req.body);
        res.status(200).json(associadoAtualizado);
    } catch (erro) {
        // 404 Not Found ou 400 (Validação)
        tratarErro(res, erro, 'Erro ao atualizar associado.');
    }
};

// [DELETE] /api/associados/:cpf: Deleta por CPF
const deletarAssociado = async (req, res) => {
    try {
        const { cpf } = req.params;
        await servicoAssociados.deletarAssociado(cpf);
        // 204 No Content
        res.status(204).send(); 
    } catch (erro) {
        // 404 Not Found
        tratarErro(res, erro, 'Erro ao deletar associado.');
    }
};

module.exports = {
    criarAssociado,
    buscarTodosAssociados,
    buscarPorCpf,
    atualizarAssociado,
    deletarAssociado,
};