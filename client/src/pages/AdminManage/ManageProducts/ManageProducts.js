import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import Spinner from 'shared/components/Spinner';
import SelectListGroup from 'shared/components/SelectListGroup';

import {
  // getProducts,
  deleteProduct,
  getProductsByCategory
} from 'store/actions/productAction';
import { getCategories } from 'store/actions/categoryAction';

import { toast, ToastContainer } from 'react-toastify';
import NumberFormat from 'react-number-format';

class ManageProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'null'
    };
  }

  componentDidMount() {
    this.props
      .getCategories()
      .then(res => this.props.getProductsByCategory(this.state.category));
  }

  onChange(e) {
    this.setState({
      category: e.target.value
    });

    this.props.getProductsByCategory(e.target.value);
  }

  onDelete(id) {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      this.props
        .deleteProduct(id)
        .then(res =>
          toast.success('Deleted successfully', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          })
        )
        .catch(err =>
          toast.error('Error can not delete, try again', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          })
        );
    }
  }
  render() {
    // Get products list and loading state
    const { products, loading } = this.props.product;
    const spinner = loading ? <Spinner /> : null;

    const categories =
      this.props.category.categories.length > 0
        ? this.props.category.categories
        : [];

    const productContent =
      products.length > 0 ? (
        products.map((product, index) => (
          <tr key={product._id}>
            <td>{index + 1}</td>
            <td>{product.name}</td>
            <td>{product.quantity}</td>
            <td>
              <NumberFormat
                value={product.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </td>
            <td>{product.note}</td>
            <td>{product.category.name}</td>
            <td>
              <Moment format="D MMM YY">{product.date}</Moment>
            </td>
            <td>
              <Link
                className="btn"
                to={`${this.props.location.pathname}/edit/${product._id}`}
              >
                <i className="fas fa-pen" />
              </Link>
              <a
                className="btn text-danger"
                onClick={this.onDelete.bind(this, product._id)}
              >
                <i className="fas fa-trash" />
              </a>

              {/* <button
            onClick={this.onDelete.bind(this, product._id)}
            className="btn btn-danger"
          >
            Delete
          </button> */}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8">
            <p className="text-center">
              {loading ? 'Loading...' : 'No Product, please add more!'}
            </p>
          </td>
        </tr>
      );

    return (
      <div className="product-list text-center">
        <h2 className="mb-4">Manage Products</h2>
        <div className="containt-filter">
          <div className="row">
            <div className="col-md-3">
              {categories.length > 0 ? (
                <SelectListGroup
                  name="category"
                  value={this.state.category}
                  options={categories}
                  onChange={this.onChange.bind(this)}
                  filter={true}
                />
              ) : null}
            </div>
            <div className="col-md-9 text-right">
              <Link
                className="btn btn-info ml-auto my-2"
                to={`${this.props.location.pathname}/add`}
              >
                Add New Product
              </Link>
            </div>
          </div>
        </div>

        {spinner}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Note</th>
              <th>Category</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>{productContent}</tbody>
        </table>
        <ToastContainer />
      </div>
    );
  }
}

ManageProducts.propTypes = {
  getProductsByCategory: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  product: state.product,
  category: state.category
});
export default connect(
  mapStateToProps,
  { deleteProduct, getCategories, getProductsByCategory }
)(ManageProducts);
