# 🏛️ API CRUD de Associados (N2)

Esta é uma API RESTful desenvolvida em Node.js e Express para gerenciar o cadastro de associados de um clube, focada em demonstrar a implementação de operações CRUD (Create, Read, Update, Delete), assincronismo e uma arquitetura organizada em camadas (Data, Service, Controller).

O "banco de dados" é uma simulação em memória, com funções que utilizam `Promise` para simular I/O assíncrono e garantir a aplicação correta de `async/await` em toda a aplicação.

## 🚀 Como Executar

### Pré-requisitos
* [Node.js](https://nodejs.org/) (Versão recomendada: 18 ou superior)
* [npm](https://www.npmjs.com/) (Instalado com o Node.js)

### Passos de Instalação

1.  Clone este repositório ou baixe os arquivos.
2.  Navegue até a pasta raiz do projeto.
3.  Instale as dependências:

    ```bash
    npm install
    ```

### Iniciar a Aplicação

Para iniciar o servidor:

```bash
npm start
# Ou, para desenvolvimento com recarregamento automático (requer nodemon instalado globalmente ou como devDependency):
# npm run dev
```

# 🚀 Servidor e URL Base

O servidor será iniciado na **porta 3000**.  
A URL base da API é: [http://localhost:3000/api](http://localhost:3000/api)

---

## 🗺️ Endpoints da API

A API manipula o recurso `/associados` no prefixo `/api`.  
O modelo de dados de um **Associado** possui os campos:

- `cpf_associado`
- `nome_associado`
- `email_associado`

| Método | Endpoint | Descrição |
|:-------|:----------|:-----------|
| **GET** | `/api` | Exibe a mensagem de boas-vindas e a lista de endpoints. |
| **POST** | `/api/associados` | Cria um novo associado. <br>*(Corpo JSON obrigatório: `cpf_associado`, `nome_associado`, `email_associado`)* |
| **GET** | `/api/associados` | Lista todos os associados cadastrados. |
| **GET** | `/api/associados/:cpf` | Busca um associado pelo CPF. *(Parâmetro na URL)* |
| **GET** | `/api/associados/cpf/:cpf` | Busca um associado pelo CPF. *(Endpoint adicional conforme requisito N2)* |
| **PUT** | `/api/associados/:cpf` | Atualiza os dados de um associado pelo CPF. *(Corpo JSON com dados a serem alterados)* |
| **DELETE** | `/api/associados/:cpf` | Remove um associado pelo CPF. |

---

## 💻 Exemplos de Teste (PowerShell / Windows)

Para testar a API no **Windows PowerShell**, utilize o cmdlet nativo `Invoke-RestMethod` (`irm`), que manipula o envio de JSON de forma confiável.

---

### 1. 🧩 CREATE (Criar Associado - POST)

Este exemplo cadastra o associado com CPF `12345678901`.

```powershell
# 1. Cria a estrutura de dados (HashTable)
$body = @{
    cpf_associado = "12345678901"
    nome_associado = "Talita Sophia"
    email_associado = "talita.s@email.com"
} 

# 2. Converte para JSON
$jsonBody = $body | ConvertTo-Json

# 3. Executa a requisição POST
Invoke-RestMethod -Uri http://localhost:3000/api/associados -Method Post -Body $jsonBody -ContentType "application/json"
# Deve retornar Status 201 Created e o objeto do associado.
```

### 2. 📋 READ ALL (Consultar Todos - GET)

```powershell
# O método GET é o padrão
Invoke-RestMethod -Uri http://localhost:3000/api/associados
# Deve retornar uma lista com todos os associados.
```

### 3. 🔍 READ ONE (Buscar por CPF - GET)

```powershell

# Consulta o associado criado pelo seu CPF na URL
Invoke-RestMethod -Uri http://localhost:3000/api/associados/12345678901
# Deve retornar Status 200 OK e o objeto JSON do associado.
```

### 4. ✏️ UPDATE (Atualizar por CPF - PUT)

```powershell
# 1. Cria o corpo de atualização (apenas o campo a ser alterado)
$updateBody = @{
    nome_associado = "Talita A. Atualizada"
} 
$updateJson = $updateBody | ConvertTo-Json

# 2. Executa a requisição PUT
Invoke-RestMethod -Uri http://localhost:3000/api/associados/12345678901 -Method Put -Body $updateJson -ContentType "application/json"
# Deve retornar Status 200 OK e o objeto atualizado.
```

### 5. 🗑️ DELETE (Deletar por CPF - DELETE)

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/associados/12345678901 -Method Delete
# Deve retornar Status 204 No Content.
```

## 📐 Arquitetura do Projeto

O projeto segue o **padrão de Camadas Modulares**, garantindo a separação de responsabilidades:

### 🧩 Estrutura de Arquivos

- **`server.js`**  
  Ponto de entrada da aplicação.  
  Importa o `app.js` e inicia o servidor Express na porta 3000.

- **`src/app.js`**  
  Configura o Express, adiciona middlewares (como `body-parser`), importa as rotas e define o middleware de tratamento de erro genérico.

- **`src/data/associado.data.js`** *(Camada de Dados)*  
  - Simula o banco de dados em memória (`associadosDB`).  
  - Contém funções CRUD de baixo nível que simulam operações assíncronas de I/O (`simulateAsyncOperation`).

- **`src/service/associados.services.js`** *(Camada de Serviço / Negócio)*  
  - Implementa a lógica de negócio, como validação dos dados do associado (`validateAssociado`).  
  - Trata exceções específicas (ex: “Associado não encontrado”, com status `404`).  
  - Interage exclusivamente com a **Camada de Dados**.

- **`src/controllers/associados.controllers.js`** *(Camada de Controle)*  
  - Recebe a requisição HTTP (`req.body`, `req.params`).  
  - Chama a função correspondente da **Camada de Serviço**.  
  - Gerencia a resposta HTTP (status `200`, `201`, `204`) e o corpo em JSON.  
  - Inclui tratamento de erro (`handleError`) que mapeia exceções para os status HTTP apropriados.

- **`src/routes/associados.routes.js`** *(Camada de Roteamento)*  
  - Define os caminhos (URLs) e métodos HTTP (GET, POST, etc.).  
  - Associa cada rota à função de **Controller** correspondente.

---

## ✨ Destaques Técnicos

- **Modularização e Camadas:**  
  Separação clara das responsabilidades (**Data**, **Service**, **Controller**) para melhor manutenção e escalabilidade.

- **Assincronismo:**  
  Uso de `Promise` e `async/await` em todas as camadas para simular e gerenciar operações de I/O de forma não bloqueante.

- **Tratamento de Exceções:**  
  Uso de `try/catch` e funções auxiliares para tratar erros de **validação (400)** e
