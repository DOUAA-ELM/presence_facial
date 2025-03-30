import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find();
    res.send(products);
  })
);

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'name ' + Date.now(),
      slug: '-name-' + Date.now(),
      image: '/images/NOT_FOUND.jpg',
      price: 0,
      category: 'Femme',
      brand: ' brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: ' description',
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const category = query.category || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: `^${searchQuery}`,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
    });

    res.send({ products });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get(
  '/suggest',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.query || '';

    if (!searchQuery) {
      return res.send([]); // Si la requête de recherche est vide, retourner une liste vide
    }

    const queryFilter = {
      name: {
        $regex: `^${searchQuery}`, // Cherche les noms commençant par searchQuery
        $options: 'i',
      },
    };

    const suggestions = await Product.find(queryFilter).limit(10); // Limite le nombre de suggestions retournées

    res.send(suggestions);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
