const { pool } = require('./db'); // Importa o pool de conexões

// Cria um novo associado
const criar = async (associado) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { cpf_associado, nome_associado, email_associado } = associado;
    
    const sql = 'INSERT INTO associados (cpf_associado, nome_associado, email_associado) VALUES (?, ?, ?)';
    await conn.query(sql, [cpf_associado, nome_associado, email_associado]);
    
    return associado; // Retorna o objeto criado
  } catch (erro) {
    // Trata erro de duplicidade (ER_DUP_ENTRY) do MariaDB/MySQL
    if (erro.code === 'ER_DUP_ENTRY') {
      throw new Error('Associado com este CPF ou Email já existe.');
    }
    throw erro; // Lança outros erros
  } finally {
    if (conn) conn.release();
  }
};

// Lista todos
const buscarTodos = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    // O MariaDB retorna os resultados como array
    const associados = await conn.query('SELECT * FROM associados');
    return associados;
  } finally {
    if (conn) conn.release();
  }
};

// Busca por CPF
const buscarPorCpf = async (cpf) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const associados = await conn.query('SELECT * FROM associados WHERE cpf_associado = ?', [cpf]);
    // Retorna o primeiro elemento (o registro) ou null se não for encontrado
    return associados.length > 0 ? associados[0] : null;
  } finally {
    if (conn) conn.release();
  }
};

// Atualiza por CPF
const atualizar = async (cpf, dadosAtualizados) => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    const campos = [];
    const valores = [];

    // Monta a query dinamicamente apenas com os campos fornecidos
    if (dadosAtualizados.nome_associado !== undefined) {
      campos.push('nome_associado = ?');
      valores.push(dadosAtualizados.nome_associado);
    }
    if (dadosAtualizados.email_associado !== undefined) {
      campos.push('email_associado = ?');
      valores.push(dadosAtualizados.email_associado);
    }
    
    if (campos.length === 0) {
        // Se não houver campos para atualizar, apenas busca e retorna o associado
        return buscarPorCpf(cpf);
    }

    valores.push(cpf); // Adiciona o CPF para o WHERE
    
    const sql = `UPDATE associados SET ${campos.join(', ')} WHERE cpf_associado = ?`;
    const resultado = await conn.query(sql, valores);

    // Verifica se alguma linha foi afetada para saber se o associado existia
    if (resultado.affectedRows === 0) {
        return null; // Não encontrado
    }
    
    // Busca e retorna o objeto atualizado (padrão mantido)
    return buscarPorCpf(cpf);

  } catch (erro) {
    // Trata erro de duplicidade (ex: email atualizado já existe)
     if (erro.code === 'ER_DUP_ENTRY') {
      throw new Error('Email já está em uso por outro associado.');
    }
    throw erro; 
  } finally {
    if (conn) conn.release();
  }
};

// Deleta por CPF
const remover = async (cpf) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const resultado = await conn.query('DELETE FROM associados WHERE cpf_associado = ?', [cpf]);
    // Retorna true se 1 ou mais linhas foram afetadas (deletadas), false se 0 (não encontrado)
    return resultado.affectedRows > 0;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  criar,
  buscarTodos,
  buscarPorCpf,
  atualizar,
  remover,
};