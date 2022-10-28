import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from 'shared/components/TextFieldGroup';
import SelectListGroup from 'shared/components/SelectListGroup';
import { withRouter } from 'react-router-dom';

import { getProduct, editProduct } from 'store/actions/productAction';
import { getCategories } from 'store/actions/categoryAction';

import Spinner from 'shared/components/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import NumberFormat from 'react-number-format';
import classnames from 'classnames';
import { acceptedFileTypes, verifyFile } from 'shared/helpers/UtilsFile';

class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();

    this.state = {
      name: '',
      price: 0,
      quantity: 0,
      note: '',
      category: '',
      image: null,
      preview: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getProduct(this.props.match.params.id);
    this.props.getCategories();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product.product._id !== this.props.product.product._id) {
      const product = nextProps.product.product;

      this.setState({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        note: product.note,
        category: product.category,
        image: product.image
      });
    }

    // if (nextProps.errors.product) {
    //   NotificationManager.warning(nextProps.errors.product, 'Error', 3000);
    // }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileSelect = event => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const isVerified = verifyFile(files);
      if (isVerified) {
        const currentFile = files[0];

        // Convert file to base64
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          'load',
          () => {
            const base64PreviewImage = myFileItemReader.result;
            // Set image preview
            this.setState({ preview: base64PreviewImage });
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);

        // const base64PreviewImage = fileToBase64(currentFile);
        // console.log('base64PreviewImage', currentFile, base64PreviewImage);

        // Set file to state
        this.setState({ image: currentFile });
      }
    }
  };

  onResetImage = () => {
    this.setState({ image: this.props.product.product.image, preview: '' });
    this.fileInputRef.current.value = null;
  };
  onSubmit = e => {
    e.preventDefault();
    const productData = {
      name: this.state.name,
      price: this.state.price,
      quantity: this.state.quantity,
      note: this.state.note,
      category: this.state.category,
      image: this.state.image
    };

    this.props
      .editProduct(this.props.match.params.id, productData, this.props.history)
      .then(
        res =>
          toast.success('Updated successfully', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500
          })
        // NotificationManager.success('Updated successfully', 'Status')
      )
      .catch(err =>
        toast.error('Error can not update, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500
        })
      );
  };
  render() {
    const { errors, image, preview } = this.state;

    const { loading } = this.props.product;
    const categories =
      this.props.category.categories.length > 0
        ? this.props.category.categories
        : [];

    const spinner = loading || categories.length === 0 ? <Spinner /> : null;
    return (
      <div className="modify-product">
        <div className="row">
          <div className="col-md-6 offset-md-2">
            <h3 className="text-center mb-4">Update Product</h3>
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
                label="Quantity"
                name="quantity"
                type="number"
                placeholder="Enter Quantity"
                value={this.state.quantity}
                onChange={this.onChange}
                error={errors.quantity}
              />
              {/* <TextFieldGroup
                label="Price"
                name="price"
                placeholder="Enter Price"
                value={this.state.price}
                onChange={this.onChange}
                error={errors.price}
              /> */}
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <NumberFormat
                  label="Price"
                  name="price"
                  className={classnames('form-control', {
                    'is-invalid': errors.price
                  })}
                  placeholder="Enter Price"
                  thousandSeparator={true}
                  value={this.state.price}
                  prefix="$"
                  onValueChange={values => {
                    // const { formattedValue, value } = values;
                    const { value } = values;
                    this.setState({ price: value });
                  }}
                />
                {errors.price && (
                  <div className="invalid-feedback">{errors.price}</div>
                )}
              </div>

              <TextFieldGroup
                label="Note"
                name="note"
                placeholder="Enter Note"
                value={this.state.note}
                onChange={this.onChange}
                error={errors.note}
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
              <div className="form-group">
                <label>Image</label>
                <div className="custom-file">
                  <input
                    ref={this.fileInputRef}
                    type="file"
                    className="custom-file-input"
                    id="customFile"
                    accept={acceptedFileTypes}
                    multiple={false}
                    onChange={this.handleFileSelect}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    {image
                      ? image.name
                        ? image.name
                        : image
                      : 'Choose image for product'}
                  </label>
                </div>
              </div>
              <input
                type="submit"
                value="Submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
          <div className="col-md-4">
            <div className="preview-area mx-auto">
              {preview ? (
                <div>
                  <img src={preview} alt="preview" />
                  <p>Preview Image</p>
                  <button
                    className="btn btn-light btn-block"
                    onClick={this.onResetImage}
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <div
                  className="text-center mx-auto"
                  style={{ minHeight: '100px' }}
                >
                  {image ? (
                    <img src={`/` + image} alt="preview" />
                  ) : (
                    <div>
                      <h3>This product dont have image</h3>
                      <i className="far fa-dizzy fa-5x" />
                    </div>
                  )}

                  <p>Current Image</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*<NotificationContainer />*/}
        <ToastContainer />
      </div>
    );
  }
}

EditProduct.propTypes = {
  getCategories: PropTypes.func.isRequired,
  editProduct: PropTypes.func.isRequired,
  getProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  product: state.product,
  category: state.category
});

export default connect(
  mapStateToProps,
  { getProduct, editProduct, getCategories }
)(withRouter(EditProduct));
