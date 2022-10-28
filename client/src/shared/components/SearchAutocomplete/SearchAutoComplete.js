import React, { Component } from 'react';
import './SearchAutoComplete.css';
import PropTypes from 'prop-types';

class SearchAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFocus: -1
    };
  }
  componentDidMount() {
    this.setState({ currentFocus: -1 });
  }

  handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 40:
        //If the arrow DOWN key is pressed
        this.setState(state => ({
          currentFocus: state.currentFocus + 1
        }));
        // this.test = this.test + 1;
        if (this.state.currentFocus >= this.props.options.length - 1) {
          this.setState({ currentFocus: 0 });
        }
        break;
      case 38:
        // If the arrow UP key is pressed
        this.setState(state => ({
          currentFocus: state.currentFocus - 1
        }));

        if (this.state.currentFocus <= 0) {
          this.setState({
            currentFocus: this.props.options.length - 1
          });
        }
        break;
      case 13:
        //If the ENTER key is pressed
        e.preventDefault();
        if (this.state.currentFocus > -1) {
          this.props.onClick(this.props.options[this.state.currentFocus]);
        } else {
          this.props.onClick(e.target.value);
        }
        break;
      default:
        this.setState({ currentFocus: -1 });
        break;
    }
  };

  render() {
    const { value, options, onClick, onChange, ...props } = this.props;
    return (
      <div className="autocomplete input-group">
        <input
          {...props}
          value={value}
          onChange={onChange}
          onKeyDown={this.handleKeyDown}
          className="form-control"
        />
        <div className="input-group-append">
          <span className="input-group-text" onClick={e => onClick(value)}>
            Search
          </span>
          {value && (
            <span className="input-clear" onClick={e => onClick('')}>
              x
            </span>
          )}
        </div>
        {value && options.length ? (
          <ul className="autocomplete-items list-group">
            {options.map((option, index) => (
              <li
                className={
                  'list-group-item ' +
                  (this.state.currentFocus === index ? 'suggest-active' : '')
                }
                key={index}
                onClick={e => onClick(option)}
              >
                {' '}
                <strong>{option.substr(0, value.length)}</strong>
                {option.substr(value.length)}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
}

SearchAutoComplete.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SearchAutoComplete;
