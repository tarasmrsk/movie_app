import React from 'react'
import { Rate } from 'antd'

function MovieRate({ onRatingChange }) {

  const handleRatingChange = (rating) => {
    onRatingChange(rating)
  }

  return (
    <Rate allowHalf defaultValue={0.0} count={10} onChange={handleRatingChange} />
  )
}

export default MovieRate
