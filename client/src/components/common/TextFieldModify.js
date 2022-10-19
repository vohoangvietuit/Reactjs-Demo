import React from 'react';
import PropTypes from 'prop-types';

const TextFieldMofidy = ({
  error,
  info,
  label,
  name,
  isEdit,
  value,
  icon,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      {isEdit ? (
        <div>
          {icon && <i title={name} className={'mr-2 ' + icon} />}
          <input
            {...props}
            id={name}
            name={name}
            value={value}
            style={{
              borderColor: error ? '#dc3545' : ''
            }}
            className="input-modify"
          />
          {info && <small className="form-text text-muted">{info}</small>}
          {error && (
            <div
              style={{ display: 'block', fontSize: '0.4em' }}
              className="invalid-feedback"
            >
              {error}
            </div>
          )}
        </div>
      ) : (
        <p>
          {icon && <i title={name} className={'mr-2 ' + icon} />}
          {value ? value : `Please enter ${name}`}
        </p>
      )}
    </div>
  );
};

TextFieldMofidy.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  disabled: PropTypes.string,
  label: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string
};

TextFieldMofidy.defaultProps = {
  type: 'text',
  isEdit: false
};

export default TextFieldMofidy;
