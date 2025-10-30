// server.js

// 1. Importa o arquivo app.js (onde toda a API está configurada)
const app = require('./src/app'); // ⬅️ Caminho correto: Procure dentro da pasta 'src'

// 2. Define a porta onde o servidor irá rodar
const PORT = 3000; 

// 3. Inicia o servidor usando a aplicação configurada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`API pronta em: http://localhost:${PORT}/api`);
});