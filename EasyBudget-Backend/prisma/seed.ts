import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.gasto.createMany({
    data: [
      {
        descricao: 'Supermercado',
        valor: 150.75,
        data: new Date('2025-04-01'),
        categoria: 'Alimentação',
      },
      {
        descricao: 'Restaurante',
        valor: 80.0,
        data: new Date('2025-04-03'),
        categoria: 'Alimentação',
      },
      {
        descricao: 'Uber',
        valor: 40.0,
        data: new Date('2025-04-02'),
        categoria: 'Transporte',
      },
      {
        descricao: 'Cinema',
        valor: 30.0,
        data: new Date('2025-04-05'),
        categoria: 'Lazer',
      },
      {
        descricao: 'Combustível',
        valor: 100.0,
        data: new Date('2025-04-04'),
        categoria: 'Transporte',
      },
    ],
  });

  console.log('🌱 Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
