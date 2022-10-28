import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from 'shared/components/TextFieldGroup';
import { withRouter } from 'react-router-dom';

import { getCategory, editCategory } from 'store/actions/categoryAction';

import { ToastContainer, toast } from 'react-toastify';

class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      brand: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getCategory(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category.category._id !== this.props.category.category._id) {
      const category = this.props.category.category;

      this.setState({
        name: category.name,
        brand: category.brand
      });
    }

    if (this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const categoryData = {
      name: this.state.name,
      brand: this.state.brand
    };

    this.props
      .editCategory(
        this.props.match.params.id,
        categoryData,
        this.props.history
      )
      .then(res =>
        toast.success('Update successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500
        })
      )
      .catch(err =>
        toast.error('Error can not add, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500
        })
      );
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="modify-product">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h3 className="text-center mb-4">Edit Category</h3>
            <div className="text-right">
              <a
                type="button"
                onClick={() => this.props.history.goBack()}
                className="btn btn-light mb-1"
              >
                Go Back
              </a>
            </div>

            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                label="Name"
                name="name"
                placeholder="Enter Name"
                value={this.state.name}
                onChange={this.onChange}
                error={errors.name}
              />
              <TextFieldGroup
                label="Brand"
                name="brand"
                placeholder="Enter Brand"
                value={this.state.brand}
                onChange={this.onChange}
                error={errors.brand}
              />
              <input
                type="submit"
                value="Submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

EditCategory.propTypes = {
  getCategory: PropTypes.func.isRequired,
  editCategory: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  category: state.category,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCategory, editCategory }
)(withRouter(EditCategory));
