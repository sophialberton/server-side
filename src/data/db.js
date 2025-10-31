const mariadb = require('mariadb');

// Configuração do pool de conexões.
const pool = mariadb.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clube_associados',
    connectionLimit: 5,
});

/**
 * Tenta conectar e criar a tabela 'associados' se não existir.
 * @throws {Error} Se a conexão ou inicialização falhar.
 */
async function initDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();
        
        // Tabela para Associados. 'cpf_associado' é a chave primária.
        const sqlCreate = `
            CREATE TABLE IF NOT EXISTS associados (
                cpf_associado VARCHAR(15) PRIMARY KEY,
                nome_associado VARCHAR(255) NOT NULL,
                email_associado VARCHAR(255) UNIQUE NOT NULL
            );
        `;
        await conn.query(sqlCreate);
        console.log('Tabela "associados" verificada/criada com sucesso.');
    } catch (err) {
        console.error('Erro ao conectar ou inicializar o banco de dados:', err.message);
        // Lança o erro para que a aplicação não inicie
        throw new Error('Falha na inicialização do banco de dados.');
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    pool,
    initDatabase,
};