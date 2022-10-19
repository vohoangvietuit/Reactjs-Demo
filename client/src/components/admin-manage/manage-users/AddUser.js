import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../../common/TextFieldGroup';
import { withRouter } from 'react-router-dom';

import { addUser } from '../../../actions/userAction';

import { ToastContainer, toast } from 'react-toastify';

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      location: '',
      phone: '',
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
    const userData = {
      name: this.state.name,
      location: this.state.location,
      phone: this.state.phone,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props
      .addUser(userData, this.props.history)
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
            <h3 className="text-center mb-4">Add User</h3>
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
                label="Email"
                type="email"
                name="email"
                placeholder="Enter Email"
                value={this.state.email}
                onChange={this.onChange}
                error={errors.email}
              />
              <TextFieldGroup
                label="Location"
                name="location"
                placeholder="Enter Location"
                value={this.state.location}
                onChange={this.onChange}
                error={errors.location}
              />
              <TextFieldGroup
                label="Phone"
                name="phone"
                placeholder="Enter Phone"
                value={this.state.phone}
                onChange={this.onChange}
                error={errors.phone}
              />
              <TextFieldGroup
                label="Password"
                placeholder="Password"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                error={errors.password}
              />
              <TextFieldGroup
                label="Confirm Password"
                placeholder="Confirm Password"
                name="password2"
                type="password"
                value={this.state.password2}
                onChange={this.onChange}
                error={errors.password2}
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

AddUser.propTypes = {
  addUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addUser }
)(withRouter(AddUser));
