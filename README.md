# 💸 EasyBudget - Gerenciador de Gastos

Aplicação backend em Node.js com TypeScript, Express e Prisma, conectada a um banco PostgreSQL para gerenciamento de gastos pessoais.

## 🚀 Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose

---

## 🛠️ Como rodar o projeto

### 🔧 Clonando o repositório

```bash
git clone https://github.com/seu-usuario/easybudget-backend.git
cd easybudget-backend


📦 Instalando as dependências

npm install

🧪 Rodando em ambiente local (sem Docker)
Crie o arquivo .env:

DATABASE_URL="postgresql://user:password@localhost:5432/easybudget"

Inicie seu banco PostgreSQL local (ou use Docker).

Rode as migrations do Prisma:

npx prisma migrate dev --name init

Inicie o servidor:

npm run dev



🐳 Rodando com Docker
Inicie o PostgreSQL com Docker Compose:

docker-compose up -d

Altere seu .env para apontar para o container:

DATABASE_URL="postgresql://user:password@localhost:5432/easybudget"

Rode as migrations:

npx prisma migrate dev --name init

Inicie o projeto:

npm run dev


📚 Endpoints da API
🔹 GET /gastos
Lista todos os gastos cadastrados.

🔹 POST /gastos
Cria um novo gasto.

Body JSON:

{
  "descricao": "Almoço",
  "valor": 35.90,
  "data": "2025-05-01T12:00:00.000Z",
  "categoria": "Alimentação"
}
