const express = require('express');
const router = express.Router();
const passport = require('passport');
var uniqid = require('uniqid');

// Category model
const Order = require('../../models/Order');

// Load input validation
const validateOrderInput = require('../../validation/order');

// @route   GET api/orders/all
// @desc    Get list order
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    if (req.user.isAdmin) {
      Order.find()
        .sort({
          date: -1
        })
        // .populate('user', ['name', 'email'])
        // .populate('order_detail.product')
        .then(order => {
          if (!order) {
            errors.noorder = 'There is no order';
            return res.status(404).json(errors);
          }

          res.json(order);
        })
        .catch(err => res.status(404).send(err));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   GET api/ordesr/:order_id
// @desc    Get order detail
// @access  Private admin
router.get(
  '/:order_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    if (req.user.isAdmin) {
      Order.findById(req.params.order_id)
        .then(order => {
          if (!order) {
            errors.noorder = 'There is no order';
            return res.status(404).json(errors);
          }

          res.json(order);
        })
        .catch(err => res.status(404).send(err));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   POST api/orders
// @desc    Create order
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateOrderInput(req.body);

    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    // Get field
    const newOrder = new Order({
      orderId: uniqid.time(),
      user: req.user._id,
      email: req.user.email,
      phone: req.body.phone,
      address: req.body.address,
      note: req.body.note
    });

    let totalPrice = 0;
    const { item_list } = req.body;

    if (item_list && item_list.length) {
      totalPrice = item_list.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
      }, 0);

      newOrder.price = totalPrice;
      newOrder.order_detail = item_list;
    }

    newOrder
      .save()
      .then(order => res.json(order))
      .catch(err => res.status(500).send(err));
  }
);

// @route   POST api/orders/:order_id
// @desc    Edit order
// @access  Private admin
router.post(
  '/:order_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateOrderInput(req.body);

    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    if (req.user.isAdmin) {
      // Get field
      const dataOrder = {
        phone: req.body.phone,
        address: req.body.address,
        note: req.body.note
      };

      Order.findOneAndUpdate(
        { _id: req.params.order_id },
        { $set: dataOrder },
        {
          new: true
        }
      )
        .then(order => res.json(order))
        .catch(err => res.status(400).send(err));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   DELETE api/orders/order_id
// @desc    Delete order
// @access  Private admin
router.delete(
  '/:order_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    if (req.user.isAdmin) {
      Order.findOneAndDelete({ _id: req.params.order_id })
        .then(order => res.json({ success: true }))
        .catch(err => res.status(500).send(err));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

module.exports = router;
