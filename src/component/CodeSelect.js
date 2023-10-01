import React, {useEffect, useState} from 'react';

function CodeSelect({onCodesFetch}) {
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    fetch('https://jsramverk-trian-khsa16.azurewebsites.net/codes')
        .then((response) => response.json())
        .then((result) => {
          setCodes(result.data);
          onCodesFetch(result.data);
        })
        .catch((error) => console.error('Error fetching codes:', error));
  }, [onCodesFetch]);

  return null; // This component doesn't render anything to the DOM
}

export default CodeSelect;
