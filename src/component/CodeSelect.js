import {useEffect} from 'react';
import PropTypes from 'prop-types';

/**
 * Fetches codes from our remote server and calls the provided callback.
 * @param {Object} props - The component's props.
 * @param {Function} props.onCodesFetch - A callback function
 * to handle the fetched codes.
 * @return {null} Returns null because it doesn't render anything
 */
function CodeSelect({onCodesFetch}) {
  useEffect(() => {
    fetch('http://localhost:1337/codes')
        .then((response) => response.json())
        .then((result) => {
          onCodesFetch(result.data);
        })
        .catch((error) => console.error('Error fetching codes:', error));
  }, [onCodesFetch]);

  return null;
}

CodeSelect.propTypes = {
  onCodesFetch: PropTypes.func.isRequired,
};

export default CodeSelect;
