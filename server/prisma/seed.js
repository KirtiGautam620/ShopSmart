import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up old data...');
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('🧁 Seeding Modern ShopSmart products...');

  const products = [
    {
      name: 'Artisanal Pink Velvet Cake',
      price: 1500,
      category: 'Celebration Cakes',
      description: 'A minimalist white-and-pink masterpiece, topped with fresh strawberries and single-origin vanilla bean cream.',
      image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=100',
      stock: 5
    },
    {
      name: 'Signature Berry Pastry',
      price: 250,
      category: 'Pastries',
      description: 'Luxe flaky croissant filled with forest berry compote and gold-dusted chocolate.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=100',
      stock: 20
    },
    {
      name: 'Raspberry Swirl Cupcakes',
      price: 600,
      category: 'Cupcakes',
      description: 'Set of 6 ultra-premium cupcakes with a soft raspberry core and silk buttercream.',
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=100',
      stock: 12
    },
    {
      name: 'Minimalist Macaron Collection',
      price: 1200,
      category: 'Macarons',
      description: 'A pure white-and-pink collection of our most delicate seasonal macarons.',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=100',
      stock: 10
    },
    {
      name: 'Pure Frosting Sundae',
      price: 450,
      category: 'Gifts',
      description: 'An artisanal scoop of our signature buttercream frostings, served in a handmade glass.',
      image: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=800&q=100',
      stock: 15
    },
    {
      name: 'Modern Wedding Tier',
      price: 8500,
      category: 'Wedding Cakes',
      description: 'Our most architectural wedding cake. Pure smooth white and pink ombré icing with zero-waste floral sculptures.',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&w=800&q=100',
      stock: 1
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Modern Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
