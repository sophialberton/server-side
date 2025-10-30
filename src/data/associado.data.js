// src/data/associado.data.js

// Simulação de "Banco de Dados" em memória
const associadosDB = [];

/**
 * Simula uma operação de I/O assíncrona
 * @param {function} operation A operação a ser executada
 * @returns {Promise<any>} O resultado da operação
 */
const simulateAsyncOperation = (operation) => {
  return new Promise((resolve, reject) => {
    // Simula um delay de rede/banco
    setTimeout(() => {
      try {
        const result = operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 100); 
  });
};

// --- Funções CRUD e de Busca ---

// Cria um novo associado
const create = (associado) => simulateAsyncOperation(() => {
  const exists = associadosDB.some(a => a.cpf_associado === associado.cpf_associado);
  if (exists) {
    throw new Error('Associado com este CPF já existe.');
  }
  associadosDB.push(associado);
  return associado;
});

// Lista todos os associados
const findAll = () => simulateAsyncOperation(() => {
  return associadosDB;
});

// Busca associado por CPF
const findByCpf = (cpf) => simulateAsyncOperation(() => {
  return associadosDB.find(a => a.cpf_associado === cpf);
});

// Atualiza um associado por CPF
const update = (cpf, dadosAtualizados) => simulateAsyncOperation(() => {
  const index = associadosDB.findIndex(a => a.cpf_associado === cpf);
  if (index === -1) {
    return null; // Não encontrado
  }
  // Mantém o CPF original
  associadosDB[index] = { ...associadosDB[index], ...dadosAtualizados, cpf_associado: cpf };
  return associadosDB[index];
});

// Deleta um associado por CPF
const remove = (cpf) => simulateAsyncOperation(() => {
  const index = associadosDB.findIndex(a => a.cpf_associado === cpf);
  if (index === -1) {
    return false; // Não encontrado
  }
  associadosDB.splice(index, 1);
  return true; // Deletado com sucesso
});

module.exports = {
  create,
  findAll,
  findByCpf,
  update,
  remove,
};