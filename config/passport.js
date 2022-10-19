const JwtStratery = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('user');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStratery(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            const dataUser = {
              _id: user._id,
              name: user.name,
              password: user.password,
              email: user.email,
              phone: user.phone,
              avatar: user.avatar,
              location: user.location,
              isAdmin: user.isAdmin,
              iat: jwt_payload.iat,
              exp: jwt_payload.iat
            };
            return done(null, dataUser);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
