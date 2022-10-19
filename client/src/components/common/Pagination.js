import React from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';

const Pagination = ({
  pageSize,
  totalRecord,
  currentPage,
  onClick,
  location
}) => {
  const totalPage = Math.ceil(totalRecord / pageSize);
  const queryParams = queryString.parse(location.search);

  const pathUrl =
    location.pathname +
    (queryParams.search ? '?search=' + queryParams.search + '&' : '?') +
    'category=' +
    (queryParams.category ? queryParams.category : '');

  // console.log(pathUrl);
  return (
    <ul className="pagination">
      <li className={'page-item ' + (currentPage === 1 ? 'disabled' : '')}>
        <Link
          onClick={onClick.bind(this, currentPage - 1)}
          className="page-link"
          to={pathUrl + '&page=' + (currentPage - 1)}
        >
          Previous
        </Link>
      </li>
      {Array.from(Array(totalPage), (page, index) => (
        <li
          className={'page-item ' + (currentPage === index + 1 ? 'active' : '')}
          key={index}
        >
          <Link
            onClick={onClick.bind(this, index + 1)}
            className="page-link"
            to={pathUrl + '&page=' + (index + 1)}
          >
            {index + 1}
          </Link>
        </li>
      ))}
      <li
        className={'page-item ' + (currentPage === totalPage ? 'disabled' : '')}
      >
        <Link
          onClick={onClick.bind(this, currentPage + 1)}
          className="page-link"
          to={pathUrl + '&page=' + (currentPage + 1)}
        >
          Next
        </Link>
      </li>
    </ul>
  );
};

Pagination.propTypes = {
  pageSize: PropTypes.number.isRequired,
  totalRecord: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  location: PropTypes.object
};

Pagination.defaultProps = {
  currentPage: 1
};
export default Pagination;
