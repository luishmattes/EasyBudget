// src/routes/gastos.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


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
    const { inicio, fim } = filtroSchema.parse(req.query);

    const where = inicio && fim ? {
      data: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
    } : {};

    const estatisticas = await prisma.gasto.groupBy({
      by: ['categoria'],
      _sum: {
        valor: true,
      },
      where,
    });

    res.json(estatisticas);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});



// src/routes/gastos.ts

const filtroSchema = z
  .object({
    inicio: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data de início inválida",
    }),
    fim: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data de fim inválida",
    }),
  });

router.get('/', async (req, res) => {
  try {
    const { inicio, fim } = filtroSchema.parse(req.query);

    const where = inicio && fim ? {
      data: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
    } : undefined;

    const gastos = await prisma.gasto.findMany({
      where,
      orderBy: { data: 'desc' },
    });

    res.json(gastos);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Erro ao buscar gastos:', error);
    res.status(500).json({ error: 'Erro ao buscar gastos' });
  }
});

router.get('/categorias', async (_req: Request, res: Response) => {
  try {
    const categorias = await prisma.gasto.findMany({
      select: { categoria: true },
      distinct: ['categoria'],
    });
    res.json(categorias.map((c) => c.categoria));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// GET /gastos/por-data
router.get('/por-data', async (req, res) => {
  try {
    const { inicio, fim } = filtroSchema.parse(req.query);

    const where = inicio && fim ? {
      data: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
    } : undefined;

    const resultado = await prisma.gasto.groupBy({
      by: ['data'],
      _sum: {
        valor: true,
      },
      where,
      orderBy: { data: 'asc' },
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar dados por data:', error);
    res.status(500).json({ error: 'Erro ao buscar dados por data' });
  }
});


export default router;
