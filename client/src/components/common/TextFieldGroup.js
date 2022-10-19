import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({ error, info, label, name, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        {...props}
        id={name}
        name={name}
        className={classnames('form-control', {
          'is-invalid': error,
          'form-control-lg': !label
        })}
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.string,
  label: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;
