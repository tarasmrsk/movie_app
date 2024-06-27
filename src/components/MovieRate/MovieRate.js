import React from 'react'
import { Rate } from 'antd'

function MovieRate({ movieId, rateMovie }) {
  const handleRatingChange = (newRating) => {
    rateMovie(movieId, newRating)
  }

  return (
    <Rate allowHalf defaultValue={0.0} count={10} onChange={handleRatingChange} />
  )
}

export default MovieRate