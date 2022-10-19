import React from 'react';
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';

export default props => {
  const { data, disabledCart } = props;
  const imageDefault =
    'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22348%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20348%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_165d1afb73f%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A17pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_165d1afb73f%22%3E%3Crect%20width%3D%22348%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22116.7265625%22%20y%3D%22120.3%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
  return (
    <div className="col-md-4">
      <div className="card mb-4 box-shadow">
        <img
          src={data.image ? data.image : imageDefault}
          alt="Ex"
          className="card-img-top mt-2"
        />
        <div className="card-body">
          <h4 className="card-title">{data.name}</h4>
          {/* <h5 className="price">{data.price}</h5> */}
          <p className="card-text">{data.note}</p>

          <div className="row">
            <div className="col">
              <p className="btn btn-danger btn-block">
                <NumberFormat
                  value={data.price}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
              </p>
            </div>
            <div className="col">
              {disabledCart ? (
                <button className="btn btn-success btn-block disabled">
                  In cart
                </button>
              ) : (
                <button
                  onClick={props.onClick}
                  className="btn btn-success btn-block"
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>

          <small className="text-muted d-block mt-1">
            Date release: <Moment format="D MMM YY">{data.date}</Moment>
          </small>
        </div>
      </div>
    </div>
  );
};
