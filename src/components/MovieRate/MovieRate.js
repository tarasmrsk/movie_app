import React from 'react';
import { Rate } from 'antd';

const MovieRate = ({ onRatingChange }) => {

  const handleRatingChange = (rating) => {
    onRatingChange(rating);
    console.log('Выбранная звезда:', rating);
  };

  return (
    <Rate allowHalf defaultValue={0.0} count={10} onChange={handleRatingChange} />
  );
};

export default MovieRate;