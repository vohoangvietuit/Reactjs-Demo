# Project Nash - React Demo CRUD

**Demo web:** https://nash-management.herokuapp.com/home

****Account for demo:****
* Admin email: admin@gmail.com - Pass: 123456
* User email: user@gmail.com - Pass: 123456

**Story:**
IM is a system to manage items. Each item has various props (name, price, note, quantity...) and taxonomy
(category, brand,...). There is 2 type of user, normal and admin. User can list item only and Admin can CRUD
permission.

**Feauture:**
* Docker setup (for dev)
* Implement shopping cart feature for normal user (using localStorage)
* Implement checkout feature, item quantity should be calculated
* Implement taxonomy feature and display as a drop down list in create / edit screen.
* Implement profile for user (change info, avatar)
* Implement manage products, categories, users, orders for admin
* Implement authentication, authorization only admin user can perform CRUD
* Implement search product autocomplete
* Implement pagination for shopping page
* Implement upload image to server (ex: user avatar, product image) (Ongoing to fix bug)

**Using technology:** 
* ReactJS latest (Hook) + Redux (using Hook features) + React Hook Form (Login page for example)
* NodeJS: for BE's API
* MongoDB: with mongoose lib and mLad
* ExpressJS

**Tool:** Visual Studio Code

**Deploy:** heroku web
