// menu_cli.js
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const API_BASE_URL = 'http://localhost:3000/api/associados';

const rl = readline.createInterface({ input, output });

/**
 * Função utilitária para fazer requisições à API.
 * Usa fetch e trata a resposta e os erros.
 * @param {string} url O endpoint completo.
 * @param {object} config As configurações da requisição (method, headers, body).
 */
async function fazerRequisicao(url, config = {}) {
    console.log(`\n=> ${config.method || 'GET'} ${url}`);
    try {
        const response = await fetch(url, config);
        
        // Tenta ler o corpo como JSON, mas não falha se estiver vazio (ex: 204 No Content)
        let data = {};
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else if (response.status !== 204) {
             data = await response.text();
        }

        console.log(`\n[STATUS] ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            console.error('[ERRO NA API]:', data.erro || data);
        } else {
            // Imprime o resultado formatado
            if (response.status === 204) {
                 console.log('[SUCESSO] Operação realizada sem retorno de conteúdo.');
            } else {
                console.log('[RESPOSTA]:');
                console.log(JSON.stringify(data, null, 2));
            }
        }
        return response.ok;

    } catch (error) {
        console.error('\n[ERRO DE CONEXÃO/REDE]: Não foi possível conectar à API. Certifique-se de que o servidor está rodando na porta 3000.');
        console.error('Detalhe do erro:', error.message);
        return false;
    }
}

// ------------------- Funções CRUD -------------------

async function criarAssociado() {
    console.log('\n--- CADASTRAR NOVO ASSOCIADO ---');
    try {
        const cpf = await rl.question('CPF (Obrigatório): ');
        const nome = await rl.question('Nome: ');
        const email = await rl.question('Email: ');

        const associado = {
            cpf_associado: cpf.trim(),
            nome_associado: nome.trim(),
            email_associado: email.trim()
        };

        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(associado)
        };

        await fazerRequisicao(API_BASE_URL, config);
    } catch (e) {
        console.error('Erro de entrada:', e.message);
    }
}

async function buscarTodos() {
    console.log('\n--- LISTAR TODOS OS ASSOCIADOS ---');
    await fazerRequisicao(API_BASE_URL);
}

async function buscarPorCpf() {
    console.log('\n--- BUSCAR ASSOCIADO POR CPF ---');
    const cpf = await rl.question('Digite o CPF para busca: ');
    const url = `${API_BASE_URL}/${cpf.trim()}`;
    await fazerRequisicao(url);
}

async function atualizarAssociado() {
    console.log('\n--- ATUALIZAR ASSOCIADO POR CPF ---');
    const cpf = await rl.question('Digite o CPF do associado a ser atualizado: ');
    const url = `${API_BASE_URL}/${cpf.trim()}`;
    
    console.log('\nPreencha APENAS os campos que deseja alterar (deixe em branco para ignorar):');
    const nome = await rl.question('Novo Nome: ');
    const email = await rl.question('Novo Email: ');

    const dadosAtualizados = {};
    if (nome.trim()) dadosAtualizados.nome_associado = nome.trim();
    if (email.trim()) dadosAtualizados.email_associado = email.trim();

    if (Object.keys(dadosAtualizados).length === 0) {
        console.log('[AVISO] Nenhuma alteração fornecida. Operação cancelada.');
        return;
    }

    const config = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
    };

    await fazerRequisicao(url, config);
}

async function deletarAssociado() {
    console.log('\n--- DELETAR ASSOCIADO POR CPF ---');
    const cpf = await rl.question('Digite o CPF do associado a ser DELETADO: ');
    const url = `${API_BASE_URL}/${cpf.trim()}`;

    const confirmacao = await rl.question(`Tem certeza que deseja DELETAR o associado com CPF ${cpf.trim()}? (S/N): `);

    if (confirmacao.trim().toUpperCase() === 'S') {
        const config = {
            method: 'DELETE',
        };
        await fazerRequisicao(url, config);
    } else {
        console.log('[AVISO] Operação de deleção cancelada.');
    }
}

// ------------------- Função Principal do Menu -------------------

async function menuPrincipal() {
    console.log('--- API CRUD DE ASSOCIADOS CLI ---');
    
    let rodando = true;
    while (rodando) {
        console.log('\n----------------------------------------');
        console.log('Escolha uma operação:');
        console.log('1. Criar Associado (POST /api/associados)');
        console.log('2. Listar Todos (GET /api/associados)');
        console.log('3. Buscar por CPF (GET /api/associados/:cpf)');
        console.log('4. Atualizar por CPF (PUT /api/associados/:cpf)');
        console.log('5. Deletar por CPF (DELETE /api/associados/:cpf)');
        console.log('0. Sair');
        console.log('----------------------------------------');

        const escolha = await rl.question('Opção: ');
        
        switch (escolha.trim()) {
            case '1':
                await criarAssociado();
                break;
            case '2':
                await buscarTodos();
                break;
            case '3':
                await buscarPorCpf();
                break;
            case '4':
                await atualizarAssociado();
                break;
            case '5':
                await deletarAssociado();
                break;
            case '0':
                rodando = false;
                break;
            default:
                console.log('[AVISO] Opção inválida. Tente novamente.');
        }
    }
    
    rl.close();
    console.log('\nSaindo do Menu CLI. Até mais!');
}

menuPrincipal();