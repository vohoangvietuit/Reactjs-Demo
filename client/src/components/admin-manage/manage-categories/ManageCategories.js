import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';

import { getCategories, deleteCategory } from '../../../actions/categoryAction';

import { toast, ToastContainer } from 'react-toastify';

class ManageCategories extends Component {
  componentDidMount = () => {
    this.props.getCategories();
  };

  onDelete(id) {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      this.props
        .deleteCategory(id)
        .then(res =>
          toast.success('Deleted successfully', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          })
        )
        .catch(err => {
          const error = err.product
            ? err.product
            : 'Error can not delete, try again';
          toast.error(error, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        });
    }
  }

  render() {
    const { categories, loading } = this.props.category;
    const spinner = categories.length === 0 || loading ? <Spinner /> : null;

    const categoryContent =
      categories.length > 0 ? (
        categories.map((category, index) => (
          <tr key={category._id}>
            <td>{index + 1}</td>
            <td>{category.name}</td>
            <td>{category.brand}</td>
            <td>
              <div>
                <Link
                  className="btn"
                  to={`${this.props.location.pathname}/edit/${category._id}`}
                >
                  <i className="fas fa-pen" />
                </Link>
                <a
                  className="btn text-danger"
                  onClick={this.onDelete.bind(this, category._id)}
                >
                  <i className="fas fa-trash" />
                </a>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8">
            <p className="text-center">
              {loading ? 'Loading...' : 'No Category, please add more!'}
            </p>
          </td>
        </tr>
      );
    return (
      <div className="category-list text-center">
        <h2 className="mb-4">Manage Categories</h2>
        <div className="containt-filter">
          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-9 text-right">
              <Link
                className="btn btn-info ml-auto my-2"
                to={`${this.props.location.pathname}/add`}
              >
                Add New Category
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
              <th>Brand</th>
              <th />
            </tr>
          </thead>
          <tbody>{categoryContent}</tbody>
        </table>
        <ToastContainer />
      </div>
    );
  }
}

ManageCategories.propTypes = {
  getCategories: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  category: state.category
});
export default connect(
  mapStateToProps,
  { getCategories, deleteCategory }
)(ManageCategories);
