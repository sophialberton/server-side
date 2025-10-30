// Importa o arquivo app.js (onde toda a API está configurada)
const app = require('./src/app');

// Define a porta onde o servidor irá rodar (Porta de execução)
const PORTA = 3000;

// Inicia o servidor usando a aplicação configurada
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
    console.log(`API pronta: http://localhost:${PORTA}/api`);
});