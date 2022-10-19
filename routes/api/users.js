const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const upload = require('../common/upload');
const fs = require('fs');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUserInput = require('../../validation/edit-user');
const validateChangePassInput = require('../../validation/change-pass');

// Load User model
const User = require('../../models/User');

// @route   GET api/users/current
// @desc    Get current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // res.json(req.user);
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      avatar: req.user.avatar,
      location: req.user.location,
      isAdmin: req.user.isAdmin,
      iat: req.user.iat,
      exp: req.user.iat
    });
  }
);

// @route   GET api/users/all
// @desc    Get list user
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    if (req.user.isAdmin) {
      // User.find({ isAdmin: false }, { password: 0 })
      User.find({}, { password: 0 })
        .sort({
          isAdmin: -1,
          date: -1
        })
        .then(users => {
          if (!users) {
            errors.nouser = 'There is no users';
            return res.status(404).json(errors);
          }

          res.json(users);
        })
        .catch(err => res.status(404).json({ nouser: 'There is no users' }));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   GET api/users/:id
// @desc    Get list user
// @access  Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    if (req.user.isAdmin) {
      User.findById(req.params.id)
        .then(user => {
          if (!user) {
            errors.nouser = 'There is no user';
            return res.status(404).json(errors);
          }

          res.json(user);
        })
        .catch(err => res.status(404).send(err));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exist';
      return res.status(400).json(errors);
    } else {
      // const avatar = gravatar.url(req.body.email, {
      //   s: '200', // Size
      //   r: 'pg', // Rating
      //   d: 'mm' // Default
      // });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        // avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/change-password
// @desc    Change password
// @access  Private
router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangePassInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Check Old password match
    // Check password
    bcrypt.compare(req.body.password, req.user.password).then(isMatch => {
      if (isMatch) {
        User.findOne({ _id: req.user._id }).then(user => {
          if (user) {
            const newPassword = req.body.newPassword;
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                user
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              });
            });
          }
        });
      } else {
        errors.password = 'Your current password not correct';
        return res.status(400).json(errors);
      }
    });
  }
);

// @route   GET api/users/login
// @desc    Login user / Return JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(400).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          location: user.location,
          avatar: user.avatar,
          isAdmin: user.isAdmin
        };

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 * 4 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
              userInfo: payload
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   POST api/users/
// @desc    Update Info User
// @access  Private
router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateUserInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const userField = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location
    };

    User.findByIdAndUpdate(
      req.user._id,
      { $set: userField },
      { new: true, useFindAndModify: false }
    ).then(user =>
      res.json({
        success: true,
        name: user.name,
        phone: user.phone,
        location: user.location
      })
    );
  }
);

// @route   POST api/users/update-avatar
// @desc    Update User avatar
// @access  Private
router.post(
  '/update-avatar',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    upload(req, res, error => {
      if (error) {
        res.status(400).send(error);
      } else {
        if (req.file == undefined) {
          res.status(400).send('File Undefined');
        } else {
          User.findById(req.user._id).then(user => {
            if (user) {
              // Set path for new image
              let pathImage = req.body.photo || '';

              if (req.file) {
                pathImage = 'uploads/' + req.file.filename;

                // Delete old image
                if (user.avatar) {
                  fs.unlink(`./public/${user.avatar}`, err => {
                    if (err) throw err;
                  });
                }
              }
              user.avatar = pathImage;

              // Update user avatar
              user
                .save()
                .then(user => res.json(user))
                .catch();
            } else {
              res.status(400).send('User not found');
            }
          });
        }
      }
    });
  }
);

// @route   POST api/users/:userId
// @desc    Edit user for admin
// @access  Private admin
router.post(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateUserInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (req.user.isAdmin) {
      const userField = {
        name: req.body.name,
        phone: req.body.phone,
        location: req.body.location,
        isAdmin: false
      };
      User.findOne({ _id: req.params.userId }).then(user => {
        if (user.isAdmin) {
          errors.user = 'You do not have permisson to change info this user';
          return res.status(400).json(errors);
        }

        // Update user
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: userField },
          {
            new: true
          }
        )
          .then(user => res.json(user))
          .catch(err => res.status(400).send(err));
      });
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

// @route   DELETE api/users
// @desc    Delete user
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.user.isAdmin) {
      User.findOne({ _id: req.params.id })
        .then(user => {
          if (user.isAdmin) {
            errors.user = 'You do not have permisson to delete this user';
            return res.status(400).json(errors);
          }

          User.findOneAndDelete({ _id: req.params.id })
            .then(() => res.json({ success: true }))
            .catch(err => res.status(400).send(err));
        })
        .catch(err => res.status(500).send(err));
    } else {
      errors.access = 'Access Denied';
      return res.status(400).json(errors);
    }
  }
);

module.exports = router;
