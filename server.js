// Importa o arquivo app.js (onde toda a API está configurada)
const app = require('./src/app');
// Importa a função de inicialização do DB
const { initDatabase } = require('./src/data/db'); // NOVO

// Define a porta onde o servidor irá rodar (Porta de execução)
const PORTA = 3000;

// Inicializa o BD e, se for bem-sucedido, inicia o servidor
initDatabase()
    .then(() => {
        // Inicia o servidor usando a aplicação configurada
        app.listen(PORTA, () => {
            console.log(`Servidor rodando na porta ${PORTA}`);
            console.log(`API pronta: http://localhost:${PORTA}/api`);
        });
    })
    .catch((err) => {
        console.error('A aplicação falhou ao iniciar devido a um erro no banco de dados.');
        process.exit(1); // Encerra o processo se o BD falhar
    });