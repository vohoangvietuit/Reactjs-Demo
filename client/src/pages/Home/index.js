import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'shared/components/Spinner';
import SelectListGroup from 'shared/components/SelectListGroup';
import Item from './components/Item';
import Pagination from 'shared/components/Pagination';
import queryString from 'query-string';
import isEmpty from 'shared/helpers/is-empty';
import SearchAutoComplete from 'shared/components/SearchAutocomplete/SearchAutoComplete';
import axios from 'axios';

import { getProductPaginateByCategory } from 'store/actions/productAction';
import { getCategories } from 'store/actions/categoryAction';
import { addToCart } from 'store/actions/cartAction';

import { toast, ToastContainer } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom';

function Home () {
  const [categoryKey, setCategoryKey] = useState('null');
  const [searchKey, setSearchKey] = useState('');
  const [suggests, setSuggests] = useState([]);
  let timer;
  const { product, category, cart } = useSelector(state => state);

  const dispatch = useDispatch();
  let location = useLocation();
  let history = useHistory();

  const getProductList = page => {
    const currentPage = page || 1;
    dispatch(getProductPaginateByCategory(
      searchKey,
      categoryKey,
      currentPage
    ));
  };

  useEffect(() => {
    // Set timer for input search
    timer = null;

    // Get query param from url
    const searchKey =
      queryString.parse(location.search).search || '';
    const currentPage = queryString.parse(location.search).page || 1;
    const currentCategory =
      queryString.parse(location.search).categoryKey ||
      categoryKey;

    setCategoryKey(currentCategory);
    setSearchKey(searchKey);

    dispatch(getCategories())
      .then(res =>
        dispatch(getProductPaginateByCategory(
          searchKey,
          currentCategory,
          currentPage
        ))
      );
  }, []);

  const onChangeCategory = (e) => {
    setSearchKey('');

    history.push({
      pathname: '/home',
      search: `?category=${e.target.value}&page=1`
    });

    setCategoryKey(e.target.value);

    const currentPage = 1;
    dispatch(getProductPaginateByCategory('', e.target.value, currentPage));
  }

  const triggerChange = () => {
    if (searchKey && searchKey.length > 0) {
      axios
        .get(
          `/api/products/suggest-product?search=${searchKey}&category=${categoryKey}`
        )
        .then(({ data }) => {
          setSuggests(data.map(item => item.name));
        })
        .catch(err => {
          throw err;
        });
    }
  };

  // handle when search input change
  const handleChange = e => {
    clearTimeout(timer);
    setSearchKey(e.target.value);

    timer = setTimeout(triggerChange, 500);
  };

  // handle when search input click or enter
  const handleClick = value => {
    const currentPage = 1;
    setSearchKey(value);
    setSuggests([]);

    history.push({
      pathname: '/home',
      search: `?search=${value}&category=${category}&page=1`
    });

    dispatch(getProductPaginateByCategory(
      isEmpty(value) ? 'null' : value,
      categoryKey,
      currentPage
    ));
  };

  // handle add to cart
  const handleAddToCart = product => {
    product.quantity = 1;
    dispatch(addToCart(product))
      .then(res =>
        toast.success('Product has been added to cart', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        })
      )
      .catch(err => {
        toast.error('Error can not add, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      });
  };

  const checkExistInCart = (productId) => {
    if (cart.carts.findIndex(item => item._id === productId) > -1) {
      return true;
    }
    return false;
  }

    // Get products list and loading state
    const { products, loading } = product;

    // Get data product list
    const dataProducts = products.data ? products.data : [];

    // Get page info
    const { totalRecord, pageSize, currentPage } = products;

    const spinner = loading ? <Spinner /> : null;

    // Get category list
    const categories =
      category.categories.length > 0
        ? category.categories
        : [];

    const productContent = dataProducts.length ? (
      dataProducts.map((product, index) => (
        <Item
          key={product._id}
          data={product}
          onClick={() => handleAddToCart(product)}
          disabledCart={checkExistInCart(product._id)}
        />
      ))
    ) : (
      <h3 className="mt-4 mx-auto">
        {loading || !categories.length ? 'Loading...' : 'No Product, sorry!'}
      </h3>
    );

    return (
      <div className="home text-center">
        <h2 className="mb-4">Product list</h2>
        <div className="containt-filter">
          <div className="row justify-content-between">
            <div className="col-md-3">
              {categories.length > 0 ? (
                <SelectListGroup
                  name="category"
                  value={categoryKey}
                  options={categories}
                  onChange={onChangeCategory.bind(this)}
                  filter={true}
                />
              ) : null}
            </div>
            <div className="col-md-4 text-left">
              <SearchAutoComplete
                placeholder="Search for product name..."
                value={searchKey}
                onChange={handleChange}
                onClick={handleClick}
                options={suggests}
              />
            </div>
          </div>
        </div>
        {spinner}
        <div className="product-show-list">
          <div className="row">{productContent}</div>
        </div>

        {dataProducts.length ? (
          <div className="product-info">
            <div className="row">
              <div className="col-md-6">
                <Pagination
                  pageSize={pageSize}
                  totalRecord={totalRecord}
                  currentPage={parseInt(currentPage, 10)}
                  onClick={getProductList}
                  location={location}
                />
              </div>
              <div className="col-md-6">
                <p className="text-right">Total {totalRecord} product(s)</p>
              </div>
            </div>
          </div>
        ) : null}

        <ToastContainer />
      </div>
    );
}

export default Home;