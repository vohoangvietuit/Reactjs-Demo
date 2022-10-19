const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Category model
const Category = require('../../models/Category');
const Product = require('../../models/Product');

// Load input validation
const validateCategoryInput = require('../../validation/category');

// @route   GET api/categories/test
// @desc    Tests category route
// @access  Public
router.get('/test', (req, res) =>
  res.json({
    msg: 'Categories worked'
  })
);

// @route   GET api/categories/all
// @desc    Get list categories
// @access  Public
// router.get('/all', (req, res) => {
//   const errors = {};
//   Category.find()
//     .populate('products')
//     .then(categories => {
//       if (!categories) {
//         errors.nocategories = 'There is no categories';
//         return res.status(404).json(errors);
//       }

//       res.json(categories);
//     })
//     .catch(err =>
//       res.status(404).json({ nocategories: 'There is no categories' })
//     );
// });

// @route   GET api/categories
// @desc    Get categories for select
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Category.find()
    .then(categories => {
      if (!categories) {
        errors.nocategories = 'There is no categories';
        return res.status(404).json(errors);
      }

      res.json(categories);
    })
    .catch(err =>
      res.status(404).json({ nocategories: 'There is no categories' })
    );
});

// @route   GET api/categories/:category_id
// @desc    Get product by category
// @access  Public
router.get('/productby/:category_id', (req, res) => {
  const errors = {};

  if (req.params.category_id === 'null') {
    Product.find()
      .sort({ name: 1 })
      .populate('category', ['name', 'brand'])
      .then(product => res.json(product));
  } else {
    Category.findOne({ _id: req.params.category_id })
      .then(categories => {
        if (!categories) {
          errors.nocategories = 'There is no categories';
          return res.status(404).json(errors);
        }

        Product.find({ category: req.params.category_id })
          .sort({ name: 1 })
          .populate('category', ['name', 'brand'])
          .then(product => res.json(product));
      })
      .catch(err => res.status(404).send(err));
  }
});

// @route   GET api/categories/:category_id
// @desc    Get category
// @access  Public
router.get(
  '/:category_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    if (req.user.isAdmin) {
      Category.findOne({ _id: req.params.category_id })
        .then(category => {
          if (!category) {
            errors.category = 'There is no category';
            return res.status(404).json(errors);
          }
          res.json(category);
        })
        .catch(err => res.status(404).send(err));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   POST api/categories
// @desc    Create category
// @access  Private Admin
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCategoryInput(req.body);

    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    if (req.user.isAdmin) {
      Category.findOne({
        name: { $regex: '^' + req.body.name + '$', $options: 'i' }
      }).then(category => {
        if (category) {
          errors.name = 'Category name already exists';
          return res.status(400).json(errors);
        } else {
          // Get fields
          const newCategory = new Category({
            name: req.body.name,
            brand: req.body.brand
          });

          newCategory.save().then(category => res.json(category));
        }
      });
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   POST api/categories/:category_id
// @desc    Edit category
// @access  Private Admin
router.post(
  '/:category_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCategoryInput(req.body);

    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    if (req.user.isAdmin) {
      Category.findOne({
        name: { $regex: '^' + req.body.name + '$', $options: 'i' }
      }).then(category => {
        if (category) {
          errors.name = 'Category name already exists';
          res.status(400).json(errors);
        } else {
          // Get fields
          const dataCategory = {
            name: req.body.name,
            brand: req.body.brand
          };

          // Update caterogy
          Category.findOneAndUpdate(
            { _id: req.params.category_id },
            { $set: dataCategory },
            {
              new: true
            }
          )
            .then(caterogy => res.json(caterogy))
            .catch(err => res.status(400).send(err));
        }
      });
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   DELETE api/categories/:category_id
// @desc    Delete category
// @access  Private admin
router.delete(
  '/:category_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    if (req.user.isAdmin) {
      Product.findOne({ category: req.params.category_id }).then(product => {
        if (product) {
          errors.product = 'Please delete product have this category first';
          return res.status(400).json(errors);
        } else {
          Category.findOneAndDelete({ _id: req.params.category_id })
            .then(() => res.json({ success: true }))
            .catch(err => res.status(400).send(err));
        }
      });
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

module.exports = router;
