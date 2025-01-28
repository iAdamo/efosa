import React from 'react'
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GetDestinationData from './GetDestinationData';
import GetSourceData from './GetSourceData';

function GetData() {

  const [direction, setDirection] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setDirection(queryParams.get('direction'));
  }, [location]);

  return (
    <>{direction === 'source' ? <GetSourceData /> : <GetDestinationData />}</>
  )
}

export default GetData