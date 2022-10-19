import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import TextFieldGroup from '../../common/TextFieldGroup';
import SelectListGroup from '../../common/SelectListGroup';

import { getCategories } from '../../../actions/categoryAction';

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: 0,
      quality: '',
      note: '',
      category: '',
      errors: {},
      productId: '',
      title: 'Add Product'
    };
  }
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);

    if (parsed.productId) {
      // Edit
      this.setState({ productId: parsed.productId, title: 'Update Product' });
    } else {
      // Add
      this.setState({ title: 'Add Product' });
    }
    this.props.getCategories();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const productData = {
      name: this.state.name,
      price: this.state.price,
      quality: this.state.quality,
      note: this.state.note,
      category: this.state.category
    };

    if (this.state.productId) {
      // Update
    } else {
      // Add
    }
  };
  render() {
    const { errors } = this.state;

    const categories =
      this.props.category.categories.length > 0
        ? this.props.category.categories
        : [];

    return (
      <div className="modify-product">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h3 className="text-center mb-4">{this.state.title}</h3>
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
                label="Quality"
                name="quality"
                placeholder="Enter Quality"
                value={this.state.quality}
                onChange={this.onChange}
                error={errors.quality}
              />
              <TextFieldGroup
                label="Price"
                name="price"
                type="number"
                placeholder="Enter Price"
                value={this.state.price}
                onChange={this.onChange}
                error={errors.price}
              />
              {categories.length > 0 ? (
                <SelectListGroup
                  label="Category"
                  name="category"
                  placeholder="Enter Category"
                  value={this.state.category}
                  options={categories}
                  onChange={this.onChange}
                  error={errors.category}
                />
              ) : null}
              <input
                type="submit"
                value="Submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ProductForm.propTypes = {
  getCategories: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  category: state.category
});

export default connect(
  mapStateToProps,
  { getCategories }
)(ProductForm);
