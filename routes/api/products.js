const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const upload = require('../common/upload');
const fs = require('fs');
const async = require('async');

// Product model
const Product = require('../../models/Product');
const Category = require('../../models/Category');

// Load input validation
const validateProductInput = require('../../validation/product');

const PAGE_LIMIT = 6;

// @route   GET api/products/test
// @desc    Tests product route
// @access  Public
router.get('/test', (req, res) =>
  res.json({
    msg: 'Product worked'
  })
);

// @route   GET api/products/all
// @desc    Get list product
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Product.find()
    .sort({ name: 1 })
    .populate('category', ['name', 'brand'])
    .then(products => {
      if (!products) {
        errors.products = 'There is no products';
        return res.status(404).json(errors);
      }

      res.json(products);
    })
    .catch(err => res.status(404).json({ products: 'There is no products' }));
});

// @route   GET api/products/bycategory
// @desc    Get list product paginate
// @access  Public
router.get('/bycategory', (req, res) => {
  const page = req.query.page || 1;
  const categoryId = req.query.category || 'null';
  // const searchKey = req.query.search;
  const searchKey = req.query.search !== 'null' ? req.query.search : '';

  const queryProducts = new Promise((resolve, reject) => {
    if (categoryId === 'null') {
      Product.find({ name: { $regex: '^' + searchKey, $options: 'i' } })
        .skip((page - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT)
        .sort({ name: 1 })
        .populate('category', ['name', 'brand'])
        .exec()
        .then(products => resolve(products));
    } else {
      Category.findOne({ _id: categoryId })
        .then(categories => {
          if (!categories) {
            errors.nocategories = 'There is no categories';
            return reject(errors);
          }

          Product.find({
            category: categoryId,
            name: { $regex: '^' + searchKey, $options: 'i' }
          })
            .skip((page - 1) * PAGE_LIMIT)
            .limit(PAGE_LIMIT)
            .sort({ name: 1 })
            .populate('category', ['name', 'brand'])
            .exec()
            .then(products => resolve(products));
        })
        .catch(err => reject(err));
    }
  });

  const allProductRecord = new Promise((resolve, reject) => {
    if (categoryId === 'null') {
      Product.find({ name: { $regex: '^' + searchKey, $options: 'i' } }).then(
        products => resolve(products.length)
      );
    } else {
      Category.findOne({ _id: categoryId })
        .then(categories => {
          if (!categories) {
            errors.nocategories = 'There is no categories';
            return reject(errors);
          }

          Product.find({
            category: categoryId,
            name: { $regex: '^' + searchKey, $options: 'i' }
          }).then(products => resolve(products.length));
        })
        .catch(err => reject(err));
    }
  });

  Promise.all([queryProducts, allProductRecord])
    .then(([queryProducts, allProductRecord]) => {
      res.json({
        data: queryProducts,
        totalRecord: allProductRecord,
        pageSize: PAGE_LIMIT,
        currentPage: page
      });
    })
    .catch(err => res.status(400).send(err));
});

// @route   GET api/products/bycategory
// @desc    Get list product paginate
// @access  Public
router.get('/suggest-product', (req, res) => {
  const categoryId = req.query.category || 'null';
  const searchKey = req.query.search !== 'null' ? req.query.search : '';

  if (categoryId === 'null') {
    Product.find({ name: { $regex: '^' + searchKey, $options: 'i' } })
      .sort({ name: 1 })
      .exec()
      .then(products => res.json(products));
  } else {
    Category.findOne({ _id: categoryId })
      .then(categories => {
        if (!categories) {
          errors.nocategories = 'There is no categories';
          return res.status(400).json(errors);
        }

        Product.find({
          category: categoryId,
          name: { $regex: '^' + searchKey, $options: 'i' }
        })
          .sort({ name: 1 })
          .exec()
          .then(products => res.json(products));
      })
      .catch(err => res.status(400).send(err));
  }
});

// @route   GET api/products/:id
// @desc    Get product
// @access  Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Product.findById(req.params.id)
      .then(product => {
        if (!product) {
          errors.product = 'There is no product';
          return res.status(404).json(errors);
        }

        res.json(product);
      })
      .catch(err => res.status(404).json({ product: 'There is no product' }));
  }
);

// @route   POST api/products
// @desc    Create product
// @access  Private Admin
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.user.isAdmin) {
      upload(req, res, error => {
        if (error) {
          res.status(400).send(error);
        } else {
          const { errors, isValid } = validateProductInput(req.body);

          if (!isValid) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
          }

          Product.findOne({ name: req.body.name }).then(product => {
            if (product) {
              errors.name = 'Product name already exists';
              return res.status(400).json(errors);
            } else {
              let pathImage = '';
              if (req.file) {
                pathImage = 'uploads/' + req.file.filename;
              }
              // Get fields
              const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                category: req.body.category,
                note: req.body.note,
                image: pathImage
              });
              // If category exists then add product
              newProduct
                .save()
                .then(product => res.json(product))
                .catch(err => res.status(400).send(err));
            }
          });
        }
      });
    } else {
      return res.status(400).json({ access: 'Access Denied' });
    }
  }
);

// @route   POST api/products/:product_id
// @desc    Edit product
// @access  Private Admin
router.post(
  '/:product_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.user.isAdmin) {
      upload(req, res, error => {
        if (error) {
          res.status(400).send(error);
        } else {
          const { errors, isValid } = validateProductInput(req.body);

          if (!isValid) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
          }

          // Check product id
          Product.findById(req.params.product_id)
            .then(productById => {
              if (productById) {
                // Set path for new image
                let pathImage = req.body.photo || '';

                if (req.file) {
                  pathImage = 'uploads/' + req.file.filename;

                  // Delete old image
                  if (productById.image) {
                    // Check path image exist then delete
                    if (fs.existsSync(`./public/${productById.image}`)) {
                      fs.unlink(`./public/${productById.image}`, err => {
                        if (err) throw err;
                      });
                    }
                  }
                }

                const editProduct = {
                  name: req.body.name,
                  price: req.body.price,
                  quantity: req.body.quantity,
                  category: req.body.category,
                  note: req.body.note,
                  image: pathImage
                };

                if (productById.name === editProduct.name) {
                  Product.findByIdAndUpdate(
                    req.params.product_id,
                    editProduct,
                    {
                      new: true
                    }
                  )
                    .then(product => res.json(product))
                    .catch(err => res.status(400).send(err));
                } else {
                  Product.findOne({
                    name: { $regex: req.body.name, $options: 'i' }
                  })
                    .then(product => {
                      if (product) {
                        errors.name = 'Product name already exists';
                        return res.status(400).json(errors);
                      } else {
                        Product.findByIdAndUpdate(
                          req.params.product_id,
                          editProduct,
                          {
                            new: true
                          }
                        )
                          .then(product => res.json(product))
                          .catch(err => res.status(400).send(err));
                      }
                    })
                    .catch(err => res.status(400).send(err));
                }
              } else {
                errors.name = 'Product not exists';
                return res.status(400).json(errors);
              }
            })
            .catch(err => res.status(400).send(err));
        }
      });
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   DELETE api/products/product_id
// @desc    Delete product
// @access  Private admin
router.delete(
  '/:product_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    if (req.user.isAdmin) {
      Product.findOneAndDelete({ _id: req.params.product_id })
        .then(product => {
          // Delete old imate
          if (product.image) {
            fs.unlink(`./public/${product.image}`, err => {
              if (err) throw err;
            });
          }
          res.json({ success: true });
        })
        .catch(err => res.status(400).send(err));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);
module.exports = router;
