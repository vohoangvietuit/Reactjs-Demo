import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changePassword } from '../../actions/authAction';
import { withRouter } from 'react-router-dom';

import TextFieldGroup from '../common/TextFieldGroup';

import { toast, ToastContainer } from 'react-toastify';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      newPassword: '',
      newPassword2: '',
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

    const passData = {
      password: this.state.password,
      newPassword: this.state.newPassword,
      newPassword2: this.state.newPassword2
    };

    this.props
      .changePassword(passData, this.props.history)
      .then(res =>
        toast.success('Change password success, please login to your account', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        })
      )
      .catch(err =>
        toast.error('Error happen, try again!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      );
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h1 className="display-4 text-center mb-4">Change Password</h1>
            <form onSubmit={this.onSubmit} noValidate>
              <TextFieldGroup
                placeholder="Old Password"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                error={errors.password}
              />
              <TextFieldGroup
                placeholder="New Password"
                name="newPassword"
                type="password"
                value={this.state.newPassword}
                onChange={this.onChange}
                error={errors.newPassword}
              />
              <TextFieldGroup
                placeholder="Confirm New Password"
                name="newPassword2"
                type="password"
                value={this.state.newPassword2}
                onChange={this.onChange}
                error={errors.newPassword2}
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

ChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { changePassword }
)(withRouter(ChangePassword));
