import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up old data...');
  await prisma.wishlistItem.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('🍦 Seeding Gourmet Ice Cream products...');
  
  const iceCreams = [
    // Classic Flavors
    {
      name: 'Madagascar Vanilla Bean',
      price: 380,
      category: 'Classic Flavors',
      description: 'Classic, creamy vanilla made with authentic Madagascar vanilla beans. Simple, elegant, and timeless.',
      image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=100',
      stock: 40
    },
    {
      name: 'Rich Belgian Chocolate',
      price: 400,
      category: 'Classic Flavors',
      description: 'Deep, velvety chocolate made with 70% cocoa for the ultimate chocolate lover.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=100',
      stock: 35
    },
    {
      name: 'Summer Strawberry',
      price: 350,
      category: 'Classic Flavors',
      description: 'Fresh field-picked strawberries blended into a light, creamy base.',
      image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=100',
      stock: 30
    },
    {
      name: 'Classic Butterscotch',
      price: 360,
      category: 'Classic Flavors',
      description: 'Traditional butterscotch with a smooth, buttery texture and caramel undertones.',
      image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=800&q=100',
      stock: 25
    },
    {
      name: 'Mint Chocolate Chip',
      price: 390,
      category: 'Classic Flavors',
      description: 'Cool peppermint ice cream loaded with dark chocolate chunks.',
      image: '/images/mintchoco.png',
      stock: 28
    },
    {
      name: 'Old Fashioned Pralines',
      price: 410,
      category: 'Classic Flavors',
      description: 'Vanilla ice cream with swirls of caramel and crunchy praline pecans.',
      image: '/images/old.jpeg',
      stock: 20
    },

    // Premium Tubs
    {
      name: 'Midnight Chocolate Truffle',
      price: 450,
      category: 'Premium Tubs',
      description: 'Ultra-rich dark chocolate ice cream with hand-folded Belgian chocolate truffles.',
      image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=100',
      stock: 25
    },
    {
      name: 'Salted Caramel Pecan',
      price: 480,
      category: 'Premium Tubs',
      description: 'Buttery caramel ice cream with roasted pecans and a thick ribbon of salted caramel.',
      image: '/images/caramel.jpg',
      stock: 20
    },
    {
      name: 'Hazelnut Praline Swirl',
      price: 500,
      category: 'Premium Tubs',
      description: 'Roasted hazelnut base with crunchy praline pieces and a dark chocolate swirl.',
      image: '/images/hazelnut.jpeg',
      stock: 15
    },
    {
      name: 'Red Velvet Cheesecake',
      price: 520,
      category: 'Premium Tubs',
      description: 'Cheesecake ice cream with red velvet cake chunks and a cream cheese frosting swirl.',
      image: '/images/redvelvet.avif',
      stock: 12
    },
    {
      name: 'White Chocolate Raspberry',
      price: 490,
      category: 'Premium Tubs',
      description: 'Creamy white chocolate ice cream with a tart raspberry ripple.',
      image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=100',
      stock: 18
    },
    {
      name: 'Brownie Batter Blast',
      price: 470,
      category: 'Premium Tubs',
      description: 'Fudgy brownie batter ice cream with real brownie pieces and chocolate fudge.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=100',
      stock: 22
    },

    // Dairy-Free / Vegan
    {
      name: 'Wild Berry Sorbet',
      price: 320,
      category: 'Dairy-Free',
      description: 'A refreshing, zesty blend of wild raspberries, blueberries, and strawberries. 100% vegan.',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=100',
      stock: 15
    },
    {
      name: 'Coconut Milk Mango',
      price: 350,
      category: 'Dairy-Free',
      description: 'Tropical mango puree swirled into a creamy coconut milk base. Vegan friendly.',
      image: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=800&q=100',
      stock: 18
    },
    {
      name: 'Vegan Espresso Bean',
      price: 370,
      category: 'Dairy-Free',
      description: 'Bold espresso coffee blended with almond milk and dark chocolate shavings.',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=100',
      stock: 12
    },
    {
      name: 'Lemon Zest Sorbet',
      price: 310,
      category: 'Dairy-Free',
      description: 'Tangy and bright lemon sorbet made with fresh organic lemons.',
      image: '/images/lemon.jpeg',
      stock: 25
    },
    {
      name: 'Vegan Salted Caramel',
      price: 380,
      category: 'Dairy-Free',
      description: 'Oat milk based salted caramel with a hint of Himalayan pink salt.',
      image: '/images/caramel.jpg',
      stock: 14
    },
    {
      name: 'Almond Fudge Vegan',
      price: 390,
      category: 'Dairy-Free',
      description: 'Creamy almond milk chocolate with roasted almond slivers.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=100',
      stock: 16
    },

    // Exotic / Limited Edition
    {
      name: 'Pistachio Perfection',
      price: 520,
      category: 'Exotic',
      description: 'Roasted Sicilian pistachios blended into a silky green masterpiece.',
      image: '/images/pistachio.jpeg',
      stock: 12
    },
    {
      name: 'Lavender Honeycomb',
      price: 490,
      category: 'Exotic',
      description: 'Delicate floral lavender notes with crunchy bits of handmade golden honeycomb.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=100',
      stock: 10
    },
    {
      name: 'Matcha Green Tea',
      price: 430,
      category: 'Exotic',
      description: 'Authentic ceremonial grade matcha whisked into a smooth, earthy ice cream.',
      image: '/images/matcha.webp',
      stock: 20
    },
    {
      name: 'Rose Petal Bliss',
      price: 510,
      category: 'Exotic',
      description: 'Infused with organic rose water and garnished with edible dried rose petals.',
      image: '/images/rosepetal.jpeg',
      stock: 8
    },
    {
      name: 'Spiced Chai Latte',
      price: 440,
      category: 'Exotic',
      description: 'A warm blend of cinnamon, cardamom, and cloves in a creamy milk tea base.',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=100',
      stock: 15
    },
    {
      name: 'Saffron & Pistachio',
      price: 550,
      category: 'Exotic',
      description: 'Royal saffron infused milk with generous helpings of roasted pistachios.',
      image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=100',
      stock: 10
    },

    // Fruit Specials
    {
      name: 'Mango Alphonso Bliss',
      price: 350,
      category: 'Fruit Specials',
      description: 'Made with the king of mangoes, Alphonso. Tropical and vibrant.',
      image: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=800&q=100',
      stock: 18
    },
    {
      name: 'Blueberry Cheesecake',
      price: 440,
      category: 'Fruit Specials',
      description: 'Creamy cheesecake ice cream with real blueberry bits and a graham cracker crust.',
      image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=100',
      stock: 15
    },
    {
      name: 'Peach Passionfruit',
      price: 380,
      category: 'Fruit Specials',
      description: 'Sweet peaches and tangy passionfruit combined for a refreshing summer treat.',
      image: '/images/peach.jpeg',
      stock: 20
    },

    // Limited Edition
    {
      name: 'Birthday Cake Surprise',
      price: 490,
      category: 'Limited Edition',
      description: 'Cake batter ice cream with rainbow sprinkles and chunks of real vanilla cake.',
      image: '/images/cake.webp',
      stock: 10
    },
    {
      name: 'Winter Spiced Plum',
      price: 420,
      category: 'Limited Edition',
      description: 'Roasted plums infused with cinnamon and cloves. A seasonal favorite.',
      image: '/images/plum.jpg',
      stock: 12
    },
    {
      name: 'Charcoal Black Vanilla',
      price: 530,
      category: 'Limited Edition',
      description: 'Striking black vanilla ice cream made with activated charcoal and vanilla bean.',
      image: '/images/blackvanilla.webp',
      stock: 5
    }
  ];

  console.log(`📦 Seeding ${iceCreams.length} ice cream varieties...`);

  for (const iceCream of iceCreams) {
    await prisma.product.create({
      data: iceCream,
    });
  }

  console.log('✅ Ice Cream Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
