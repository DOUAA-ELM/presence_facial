import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'boutabia',
      email: 'boutabia@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'SOUFIANE',
      email: 'soufiane@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      //_id: '1',
      name: 'DIORHOMME',
      slug: 'diorhomme',
      category: 'Homme',
      image: '/images/DIORHOMME.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Dior',
      rating: 4.5,
      numReviews: 10,
      description:
        'L alliance parfaite du jasmin et de la rose, capturée dans le parfum Duo des Fleurs de Dior',
    },
    {
      //_id: '2',
      name: 'DUO DES FLEURS',
      slug: 'duo-des-fleurs',
      category: 'Femme',
      image: '/images/duo-des-fleurs.jpg',
      price: 250,
      countInStock: 0,
      brand: 'DIOR',
      rating: 4.0,
      numReviews: 10,
      description:
        'DIOR présente Jardin Bohème, un parfum envoûtant qui capture la liberté de la nature. Des notes florales et boisées créent une expérience olfactive unique',
    },
    {
      //_id: '3',
      name: 'TOMFORD',
      slug: 'tomford',
      category: 'Homme',
      image: '/images/tomford.jpg',
      price: 25,
      countInStock: 15,
      brand: 'Gucci',
      rating: 4.5,
      numReviews: 14,
      description:
        'TOMFORD, le parfum par Gucci, incarne l essence de l élégance moderne. Une fragrance florale et sophistiquée qui célèbre la féminité sous toutes ses facettes. Laissez-vous envoûter par ses notes enivrantes et son charme intemporel, une ode à la Homme contemporaine',
    },
    {
      //_id: '4',
      name: 'JULIA',
      slug: 'julia',
      category: 'Femme',
      image: '/images/julia.jpg',
      price: 65,
      countInStock: 5,
      brand: 'Dior',
      rating: 4.5,
      numReviews: 10,
      description:
        'JULIA, le parfum emblématique de Dior, captivant et mystérieux. Une fragrance audacieuse mêlant des notes envoûtantes de fleurs, d épices et de fruits, créant une aura de séduction irrésistible',
    },
    {
      //_id: '4',
      name: 'CREED',
      slug: 'creed',
      category: 'Homme',
      image: '/images/creed.jpg',
      price: 65,
      countInStock: 5,
      brand: 'Dior',
      rating: 4.5,
      numReviews: 10,
      description:
        'CREED, le parfum emblématique de Dior, captivant et mystérieux. Une fragrance audacieuse mêlant des notes envoûtantes de fleurs, d épices et de fruits, créant une aura de séduction irrésistible',
    },
    {
      //_id: '4',
      name: 'VALERIA BOLTNEVA',
      slug: 'valeria-boltneva',
      category: 'Femme',
      image: '/images/DAISY.jpg',
      price: 65,
      countInStock: 5,
      brand: 'Dior',
      rating: 4.5,
      numReviews: 10,
      description:
        'VALERIA, le parfum emblématique de Dior, captivant et mystérieux. Une fragrance audacieuse mêlant des notes envoûtantes de fleurs, d épices et de fruits, créant une aura de séduction irrésistible',
    },
  ],
};
export default data;
