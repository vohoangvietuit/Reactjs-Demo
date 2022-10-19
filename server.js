const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
var path = require('path');

const users = require('./routes/api/users');
const products = require('./routes/api/products');
const categories = require('./routes/api/categories');
const orders = require('./routes/api/orders');
const uploadFile = require('./routes/api/uploadFile');

const app = express();

app.get('/', (req, res) => res.send('Running'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folter
app.use(express.static(path.join(__dirname, 'public')));

// DB config
mongoose.set('useFindAndModify', false); // Turn off DeprecationWarning deprecated
mongoose.set('useCreateIndex', true); // Turn off DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.

const db = require('./config/keys').mongoURI;

// Connet to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

// Use Routers
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/orders', orders);

// Just for test
app.use('/api/upload', uploadFile);

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
