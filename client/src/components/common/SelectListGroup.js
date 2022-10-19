import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const SelectListGroup = ({
  options,
  label,
  name,
  error,
  info,
  filter,
  ...props
}) => {
  const selectOptions = options.map(option => (
    <option key={option._id} value={option._id}>
      {option.name}
    </option>
  ));
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        name={name}
        id={name}
        className={classnames('form-control', {
          'is-invalid': error
        })}
        {...props}
      >
        {filter ? (
          <option value="null">Show all {name}</option>
        ) : (
          <option value="">Select {name}</option>
        )}
        {selectOptions}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  filter: PropTypes.bool
};

SelectListGroup.defaultProps = {
  filter: false
};
export default SelectListGroup;
