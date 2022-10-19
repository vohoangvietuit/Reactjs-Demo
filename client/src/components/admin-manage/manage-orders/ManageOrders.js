import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';

import { getOrders, deleteOrder } from '../../../actions/orderAction';

import { toast, ToastContainer } from 'react-toastify';

class ManageOrders extends Component {
  componentDidMount = () => {
    this.props.getOrders();
  };

  onDelete(id) {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      this.props
        .deleteOrder(id)
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
    const { orders, loading } = this.props.order;
    const spinner = orders.length === 0 || loading ? <Spinner /> : null;

    const orderContent =
      orders.length > 0 ? (
        orders.map((order, index) => (
          <tr key={order._id}>
            <td>{order.orderId}</td>
            <td>
              {order.order_detail.map(item => (
                <p key={item._id}>
                  {item.product_name} x{item.quantity}
                </p>
              ))}
            </td>
            <td>{order.email}</td>
            <td>{order.phone}</td>
            <td>{order.address}</td>
            <td>
              <NumberFormat
                value={order.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </td>
            <td className="text">
              <span title={order.note}>{order.note}</span>
            </td>
            <td>
              <Moment format="D MMM YY hh:mm:A">{order.date}</Moment>
            </td>
            <td>
              <div>
                <Link
                  className="btn"
                  to={`${this.props.location.pathname}/edit/${order._id}`}
                >
                  <i className="fas fa-pen" />
                </Link>
                <a
                  className="btn text-danger"
                  onClick={this.onDelete.bind(this, order._id)}
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
              {loading ? 'Loading...' : 'No Order, please add more!'}
            </p>
          </td>
        </tr>
      );
    return (
      <div className="order-list text-center">
        <h2 className="mb-4">Manage Orders</h2>
        <div className="containt-filter">
          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-9 text-right">
              <Link
                className="btn btn-info ml-auto my-2 disabled"
                to={`${this.props.location.pathname}/add`}
              >
                Add New Order
              </Link>
            </div>
          </div>
        </div>
        {spinner}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Product</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Price</th>
              <th>Note</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>{orderContent}</tbody>
        </table>
        <ToastContainer />
      </div>
    );
  }
}

ManageOrders.propTypes = {
  getOrders: PropTypes.func.isRequired,
  deleteOrder: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  order: state.order
});
export default connect(
  mapStateToProps,
  { getOrders, deleteOrder }
)(ManageOrders);
