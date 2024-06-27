import React, { useState, useEffect } from 'react'
import './Movie.css'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { Spin } from 'antd'

import MovieRate from '../MovieRate'

import noImage from './no_image.png'

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text
  }
    
  const truncated = `${text.substr(0, text.lastIndexOf(' ', maxLength))  }...`
  return truncated
}

const apiKey = 'api_key=2a1aa5d98370a138c9bf04a4064f7e6f'

function Movie({ id, posterPath, title, releaseDate, overview, movieGenres, voteAverage, rateMovie }) {
  const [isLoading, setIsLoading] = useState(true)
  const truncatedOverview = truncateText(overview, 100)
  const imageUrl = 'https://image.tmdb.org/t/p/w500'
  const [genres, setGenres] = useState([])

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`)
      .then(response => response.json())
      .then(data => {
        setGenres(data.genres)
        setIsLoading(false)
      })
      .catch(error => console.error('Error fetching genres:', error))
  }, [])

  if (isLoading) {
    return <Spin size="large" />
  }

  return (
    <div className='movie'>
      <img className='poster__img' src={posterPath ? `${imageUrl}${posterPath}` : noImage} alt={title} />
      <div className='movie__column'>
        <div className='title__wrapper'>
          <h3 className='movie__title'>{title}</h3>
          <div className='movie__circle' style={{
            borderColor: 
                        voteAverage >= 7 ? '#66E900' : 
                          voteAverage >= 5 ? '#E9D100' : 
                            voteAverage >= 3 ? '#E97E00' : 
                              '#E90000'
          }}>
            <span className='movie__rating'>{voteAverage === 10 ? '10' : Number(voteAverage).toFixed(1)}</span>
          </div>
        </div>
        {releaseDate && (
          <h5 className='movie__date'>
            {format(new Date(releaseDate), 'MMMM dd, yyyy', { locale: enGB })}
          </h5>
        )}
        <ul className='movie__genres'>
          {movieGenres && movieGenres.map(genreId => {
            const genre = genres.find(g => g.id === genreId)
            return <li key={genre.id}>{genre.name}</li>
          })}
        </ul>
        <p className='movie__overview'>{truncatedOverview}</p>
        <div className='movie_stars'>
          <MovieRate movieId={id} rateMovie={rateMovie} />
        </div>
      </div>
    </div>
  )
}

export default Movie