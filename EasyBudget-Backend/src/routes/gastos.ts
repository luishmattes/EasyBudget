// src/routes/gastos.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /gastos - Listar todos os gastos
router.get('/', async (req, res) => {
  const gastos = await prisma.gasto.findMany({ orderBy: { data: 'desc' } });
  res.json(gastos);
});

// POST /gastos - Criar um novo gasto
router.post('/', async (req, res) => {
  const { descricao, valor, data, categoria } = req.body;

  if (!descricao || !valor || !data || !categoria) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    const gasto = await prisma.gasto.create({
      data: {
        descricao,
        valor,
        data: new Date(data),
        categoria,
      },
    });
    res.status(201).json(gasto);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar gasto.' });
  }
});

// PUT /gastos/:id - Atualizar um gasto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, data, categoria } = req.body;

  try {
    const gasto = await prisma.gasto.update({
      where: { id: Number(id) },
      data: {
        descricao,
        valor,
        data: new Date(data),
        categoria,
      },
    });
    res.json(gasto);
  } catch (err) {
    res.status(404).json({ erro: 'Gasto não encontrado.' });
  }
});

// DELETE /gastos/:id - Remover um gasto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.gasto.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ erro: 'Gasto não encontrado.' });
  }
});

// GET /gastos/estatisticas - Estatísticas por categoria
router.get('/estatisticas', async (req, res) => {
  try {
    const estatisticas = await prisma.gasto.groupBy({
      by: ['categoria'],
      _sum: {
        valor: true,
      },
      orderBy: {
        _sum: {
          valor: 'desc',
        },
      },
    });

    res.json(estatisticas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao calcular estatísticas' });
  }
});

export default router;
