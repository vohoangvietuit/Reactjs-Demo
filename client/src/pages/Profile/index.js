import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import TextFieldMofidy from 'shared/components/TextFieldModify';
import { ToastContainer, toast } from 'react-toastify';

import { updateUserProfile } from 'store/actions/authAction';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      location: '',
      isEdit: false
    };
  }

  componentDidMount() {
    const { user } = this.props.auth;
    this.setState({
      name: user.name,
      phone: user.phone,
      location: user.location
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleEdit = () => {
    this.setState({ isEdit: !this.state.isEdit });
  };

  onCancel = () => {
    this.setState({ isEdit: false });

    const { user } = this.props.auth;
    this.setState({
      name: user.name,
      phone: user.phone,
      location: user.location
    });
  };

  onSave = e => {
    e.preventDefault();
    const userData = {
      name: this.state.name,
      phone: this.state.phone,
      location: this.state.location
    };

    this.props
      .updateUserProfile(userData)
      .then(
        res => {
          this.setState({ isEdit: false });
          toast.success('Update successfully', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500
          });
        }
        // NotificationManager.success('Updated successfully', 'Status')
      )
      .catch(err =>
        toast.error('Error can not update, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500
        })
      );
  };

  addDefaultSrc = e => {
    e.target.src = '/uploads/default-avatar.jpg';
  };
  
  render() {
    const { user } = this.props.auth;
    const { errors } = this.props;

    return (
      <div>
        <div className="profile">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="card">
                <div className="row">
                  <div className="col-6 col-md-4 my-2 mx-auto">
                    <div className="avatar-area">
                      <img
                        onError={this.addDefaultSrc}
                        src={
                          user.avatar
                            ? user.avatar
                            : '/uploads/default-avatar.jpg'
                        }
                        alt="avatar"
                        className="img-thumbnail rounded-circle"
                      />
                      <span
                        onClick={() =>
                          this.props.history.push('/change-avatar')
                        }
                        title="Change avatar"
                        className="update-btn"
                      >
                        <i className="fas fa-camera fa-2x" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="text-right mb-2">
                    {this.state.isEdit ? (
                      <span>
                        <button
                          onClick={this.onSave}
                          className="ml-1 btn btn-primary"
                        >
                          Save
                        </button>
                        <button
                          onClick={this.onCancel}
                          className="ml-1 btn btn-danger"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={this.toggleEdit}
                        className="btn btn-info px-3"
                        title="Edit profile"
                      >
                        <i className="fas fa-pen" />
                      </button>
                    )}
                  </div>
                  <div className="text-center">
                    <h1 className="card-title">
                      <TextFieldMofidy
                        name="name"
                        placeholder="Enter Name"
                        value={this.state.name}
                        onChange={this.onChange}
                        isEdit={this.state.isEdit}
                        error={errors.name}
                      />
                    </h1>
                    <div className="lead">
                      <TextFieldMofidy
                        icon="fas fa-phone fa-rotate-90"
                        name="phone"
                        placeholder="Enter Phone"
                        value={this.state.phone}
                        onChange={this.onChange}
                        isEdit={this.state.isEdit}
                        error={errors.phone}
                      />
                    </div>
                    <div className="lead">
                      <TextFieldMofidy
                        icon="fas fa-map-marker-alt"
                        name="location"
                        placeholder="Enter Location"
                        value={this.state.location}
                        onChange={this.onChange}
                        isEdit={this.state.isEdit}
                        error={errors.location}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-left m-2">
                  <a
                    type="button"
                    onClick={() => this.props.history.goBack()}
                    className="btn btn-light mb-1"
                  >
                    Go Back
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

Profile.propTypes = {
  updateUserProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { updateUserProfile }
)(Profile);
