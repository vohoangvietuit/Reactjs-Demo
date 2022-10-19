import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../../common/TextFieldGroup';
import { withRouter } from 'react-router-dom';

import { addCategory } from '../../../actions/categoryAction';

import { ToastContainer, toast } from 'react-toastify';

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      brand: '',
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
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
      .addCategory(categoryData, this.props.history)
      .then(res =>
        toast.success('Add successfully', {
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
            <h3 className="text-center mb-4">Add Category</h3>
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

AddCategory.propTypes = {
  addCategory: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addCategory }
)(withRouter(AddCategory));
