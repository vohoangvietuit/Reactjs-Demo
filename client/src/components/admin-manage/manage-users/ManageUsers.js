import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import Spinner from '../../common/Spinner';
import { getUsers, deleteUser } from '../../../actions/userAction';

import { toast, ToastContainer } from 'react-toastify';
import NumberFormat from 'react-number-format';

class ManageUsers extends Component {
  componentDidMount = () => {
    this.props.getUsers();
  };

  onDelete(id) {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      this.props
        .deleteUser(id)
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
    const { users, loading } = this.props.user;
    const spinner = users.length === 0 || loading ? <Spinner /> : null;

    const userContent =
      users.length > 0 ? (
        users.map((user, index) => (
          <tr key={user._id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.location}</td>
            <td>
              {' '}
              <NumberFormat
                value={user.phone}
                displayType="text"
                format="### ### ####"
              />
            </td>
            <td>{user.isAdmin ? 'Admin' : 'User'}</td>
            <td>
              <Moment format="D MMM YY">{user.date}</Moment>
            </td>
            <td>
              {user.isAdmin ? null : (
                <div>
                  <Link
                    className="btn"
                    to={`${this.props.location.pathname}/edit/${user._id}`}
                  >
                    <i className="fas fa-pen" />
                  </Link>
                  <a
                    className="btn text-danger"
                    onClick={this.onDelete.bind(this, user._id)}
                  >
                    <i className="fas fa-trash" />
                  </a>
                </div>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8">
            <p className="text-center">
              {loading ? 'Loading...' : 'No User Register, please add more!'}
            </p>
          </td>
        </tr>
      );

    return (
      <div className="user-list text-center">
        <h2 className="mb-4">Manage Users</h2>
        <div className="containt-filter">
          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-9 text-right">
              <Link
                className="btn btn-info ml-auto my-2"
                to={`${this.props.location.pathname}/add`}
              >
                Add New User
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
              <th>Email</th>
              <th>Location</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>{userContent}</tbody>
        </table>
        <ToastContainer />
      </div>
    );
  }
}

ManageUsers.propTypes = {
  getUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { getUsers, deleteUser }
)(ManageUsers);
