# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila o projeto TypeScript
RUN npm run build

# Etapa 2: Execução
FROM node:20

WORKDIR /app

# Copia apenas os arquivos necessários do build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Define a variável de ambiente
ENV NODE_ENV=production

# Porta que o app escuta
EXPOSE 3000

# Comando para rodar o app
CMD ["node", "dist/index.js"]
