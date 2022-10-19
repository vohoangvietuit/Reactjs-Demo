import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../../common/TextFieldGroup';
import { withRouter } from 'react-router-dom';

import { getOrder, editOrder } from '../../../actions/orderAction';

import Spinner from '../../common/Spinner';
import { ToastContainer, toast } from 'react-toastify';

class EditOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      address: '',
      note: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getOrder(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order.order._id !== this.props.order.order._id) {
      const order = nextProps.order.order;

      this.setState({
        address: order.address,
        phone: order.phone,
        note: order.note
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
    const orderData = {
      phone: this.state.phone,
      address: this.state.address,
      note: this.state.note
    };

    this.props
      .editOrder(this.props.match.params.id, orderData, this.props.history)
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
    const { order } = this.props.order;
    const { loading } = this.props.order;

    const spinner = loading ? <Spinner /> : null;

    return (
      <div className="modify-order">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h3 className="text-center mb-4">Update Order</h3>
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
                label="Email"
                name="email"
                placeholder="Enter Email"
                value={order.email ? order.email : ''}
                error={errors.name}
                disabled="disabled"
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
                label="Address"
                name="address"
                placeholder="Enter Address"
                value={this.state.address}
                onChange={this.onChange}
                error={errors.address}
              />
              <TextFieldGroup
                label="Note"
                name="note"
                placeholder="Enter Note"
                value={this.state.note}
                onChange={this.onChange}
                error={errors.note}
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

EditOrder.propTypes = {
  getOrder: PropTypes.func.isRequired,
  editOrder: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  order: state.order
});

export default connect(
  mapStateToProps,
  { getOrder, editOrder }
)(withRouter(EditOrder));
