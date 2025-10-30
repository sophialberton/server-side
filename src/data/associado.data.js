// Simulação de "Banco de Dados" (BD) em memória
const associadosBD = [];

/**
 * Simula uma operação de I/O assíncrona.
 * @param {function} operacao A função a ser executada.
 * @returns {Promise<any>} O resultado da operação.
 */
const simularOperacaoAssincrona = (operacao) => {
  return new Promise((resolver, rejeitar) => {
    // Simula delay de rede/BD
    setTimeout(() => {
      try {
        const resultado = operacao();
        resolver(resultado);
      } catch (erro) {
        rejeitar(erro);
      }
    }, 100); 
  });
};

// --- Funções de Acesso a Dados ---

// Cria um novo associado
const criar = (associado) => simularOperacaoAssincrona(() => {
  const existe = associadosBD.some(a => a.cpf_associado === associado.cpf_associado);
  if (existe) {
    throw new Error('Associado com este CPF já existe.');
  }
  associadosBD.push(associado);
  return associado;
});

// Lista todos
const buscarTodos = () => simularOperacaoAssincrona(() => {
  return associadosBD;
});

// Busca por CPF
const buscarPorCpf = (cpf) => simularOperacaoAssincrona(() => {
  return associadosBD.find(a => a.cpf_associado === cpf);
});

// Atualiza por CPF
const atualizar = (cpf, dadosAtualizados) => simularOperacaoAssincrona(() => {
  const indice = associadosBD.findIndex(a => a.cpf_associado === cpf);
  if (indice === -1) {
    return null; // Não encontrado
  }
  // Mantém o CPF original ao atualizar
  associadosBD[indice] = { ...associadosBD[indice], ...dadosAtualizados, cpf_associado: cpf };
  return associadosBD[indice];
});

// Deleta por CPF
const remover = (cpf) => simularOperacaoAssincrona(() => {
  const indice = associadosBD.findIndex(a => a.cpf_associado === cpf);
  if (indice === -1) {
    return false; // Não encontrado
  }
  associadosBD.splice(indice, 1);
  return true; // Sucesso
});

module.exports = {
  criar,
  buscarTodos,
  buscarPorCpf,
  atualizar,
  remover,
};