import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../../common/TextFieldGroup';
import { withRouter } from 'react-router-dom';

import { getUser, editUser } from '../../../actions/userAction';

import Spinner from '../../common/Spinner';
import { ToastContainer, toast } from 'react-toastify';

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      location: '',
      phone: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getUser(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.user._id !== this.props.user.user._id) {
      const user = nextProps.user.user;

      this.setState({
        name: user.name,
        location: user.location,
        phone: user.phone
      });
    }

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
      phone: this.state.phone
    };

    this.props
      .editUser(this.props.match.params.id, userData, this.props.history)
      .then(res =>
        toast.success('Update successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500
        })
      )
      .catch(err =>
        toast.error('Error can not update, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500
        })
      );
  };

  render() {
    const { errors } = this.state;
    const { loading } = this.props.user;

    const spinner = loading ? <Spinner /> : null;

    return (
      <div className="modify-user">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h3 className="text-center mb-4">Update User</h3>
            {spinner}
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

EditUser.propTypes = {
  getUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  user: state.user
});

export default connect(
  mapStateToProps,
  { getUser, editUser }
)(withRouter(EditUser));
