import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { withRouter } from 'react-router-dom';

import { addOrder } from 'store/actions/orderAction';

import { toast, ToastContainer } from 'react-toastify';

import {
  removeFromCart,
  plusItemCart,
  subItemCart
} from 'store/actions/cartAction';

class Cart extends Component {

  componentDidMount() {
    if (this.props.errors.phone || this.props.errors.address) {
      toast.error('You need to update your information in profile', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }
  }

  onOrder = () => {
    const { cart, auth } = this.props;
    const dataOrder = {
      phone: auth.user.phone,
      address: auth.user.location,
      item_list: cart.carts
    };

    this.props
      .addOrder(dataOrder, this.props.history)
      .then(res =>
        toast.success('Order successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        })
      )
      .catch(err =>
        toast.error('Error can not order, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        })
      );
  };

  onDelete(itemId) {
    this.props
      .removeFromCart(itemId)
      .then(res =>
        toast.success('Product has been remove from cart', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        })
      )
      .catch(err => {
        toast.error('Error can not remove, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      });
  }

  subItem(itemId, quantity) {
    if (quantity <= 1) {
      return alert('Minimun amount product can buy is 1');
    }
    this.props.subItemCart(itemId);
  }

  plusItem(itemId, quantity) {
    if (quantity >= 2) {
      return alert('Maximum amount product can buy is 2');
    }
    this.props.plusItemCart(itemId);
  }
  render() {
    const { carts } = this.props.cart;
    const totalPrice = carts.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);

    const cartContent = carts.length ? (
      carts.map(item => (
        <div key={item._id} className="cart-item">
          <div className="row">
            <div className="col-md-3">
              <div className="image-product">
                <img className="img-fluid" src={item.image} alt={item.name} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="info-product">
                <h4>
                  {item.name} -{' '}
                  <small className="text-muted">
                    Category: {item.category.name}
                  </small>
                </h4>
                <p>{item.note}</p>

                <a
                  className="text-danger delete-item"
                  onClick={this.onDelete.bind(this, item._id)}
                >
                  <i className="fas fa-trash" /> Remove
                </a>
              </div>
            </div>
            <div className="col-md-3">
              <NumberFormat
                value={item.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
              <div className="group-edit btn-group ml-3">
                <div
                  onClick={this.subItem.bind(this, item._id, item.quantity)}
                  className="btn btn-outline-dark edit-btn"
                >
                  -
                </div>
                <div className="btn btn-outline-dark">{item.quantity}</div>
                <div
                  onClick={this.plusItem.bind(this, item._id, item.quantity)}
                  className="btn btn-outline-dark edit-btn"
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No item in cart</p>
    );
    return (
      <div className="cart-area">
        <h2 className="mb-4 text-center">Cart</h2>
        <div className="row">
          <div className="col-md-9">{cartContent}</div>
          <div className="col-md-3">
            <div className="checkout-area p-2">
              <div className="info-price">
                <span>Total </span>
                <strong className="float-right">
                  <NumberFormat
                    value={totalPrice}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                  />
                </strong>
              </div>

              {carts.length ? (
                <div>
                  <div className="form-delivery my-4">
                    <small className="text-muted">
                      Note: Your need to enter your location and phone in your
                      profile to delivery
                    </small>
                  </div>
                  <button
                    className="btn btn-info btn-block mt-2"
                    onClick={this.onOrder}
                  >
                    Checkout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

Cart.propTypes = {
  addOrder: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  plusItemCart: PropTypes.func.isRequired,
  subItemCart: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  cart: state.cart,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addOrder, removeFromCart, plusItemCart, subItemCart }
)(withRouter(Cart));
