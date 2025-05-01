import express from 'express';
import gastosRoutes from './routes/gastos';

const app = express();
app.use(express.json());

app.use('/gastos', gastosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
