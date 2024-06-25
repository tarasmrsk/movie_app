import React from 'react'
import _ from 'lodash'
import './App.css'
import { Alert, Empty, Tabs, Pagination } from 'antd'

import Movie from '../Movie'
import Search from '../Search'
import Footer from '../Footer'

const { TabPane } = Tabs

class App extends React.Component {
  state = {
    movies: [],
    ratedMovies: [],
    searchQuery: '',
    urlApi: 'https://api.themoviedb.org/3/search/movie',
    apiKey: 'api_key=2a1aa5d98370a138c9bf04a4064f7e6f',
    guestSession: 'https://api.themoviedb.org/3/authentication/guest_session/new',
    totalPages: 0,
    page: 1,
    noResults: false,
    error: null,
    guestSessionId: null,
  }

  handlerSearchQuery = _.debounce((e) => {
    this.setState({ searchQuery: e.target.value }, () => {
      this.getMovies()
    })
  }, 600)

  componentDidMount() {
    this.getGuestSession()
  }

  getGuestSession = async () => {
    const { guestSession, apiKey } = this.state
    try {
      const response = await fetch(`${guestSession}?${apiKey}`)
      if (!response.ok) {
        throw new Error('Ошибка при создании гостевой сессии')
      }
      const data = await response.json()
      this.setState({ guestSessionId: data.guest_session_id })
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  rateMovie = async (movieId, rating) => {

    if (!movieId || !rating) {
      console.error('Необходимо указать movieId и rating')
      return
    }

    const { apiKey, guestSessionId } = this.state
    console.log(guestSessionId)
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?${apiKey}&guest_session_id=${guestSessionId}`
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTFhYTVkOTgzNzBhMTM4YzliZjA0YTQwNjRmN2U2ZiIsInN1YiI6IjY2NWRjZWJkNmJlOTk3YzA3YmEwZGU0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hYheqwmAHBAk6HFKShbJJxW4SALwyOYCZ7UN4v-j_jU'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          // 'Content-Type' :'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: rating,
        }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при попытке оценить фильм')
      }

      console.log('Фильм оценен успешно')

      this.getRatedMovies()
      
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  getRatedMovies = async () => {
    const { apiKey, guestSessionId } = this.state

    // console.log(`Получение id guest=${guestSessionId}`)

    const url = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?${apiKey}`
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTFhYTVkOTgzNzBhMTM4YzliZjA0YTQwNjRmN2U2ZiIsInN1YiI6IjY2NWRjZWJkNmJlOTk3YzA3YmEwZGU0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hYheqwmAHBAk6HFKShbJJxW4SALwyOYCZ7UN4v-j_jU'

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Ошибка при загрузке оцененных фильмов')
      }

      const data = await response.json()
      const ratedMovies = data.results

      this.setState(()=> ({
        // ratedMovies: [...prevState.ratedMovies, ...ratedMovies],
        ratedMovies: [...ratedMovies],
        error: null
      }))
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  handlePageChange = (page) => {
    this.setState({ page }, () => {
      this.getMovies()
    })
  }

  // handlerSearchQuery = _.debounce((e) => {
  //   this.setState({ searchQuery: e.target.value }, () => {
  //     // console.log(this.state.searchQuery);
  //     this.getMovies()
  //   })
  // }, 600)

  getMovies = async () => {
    const { urlApi, apiKey, searchQuery, page, guestSessionId } = this.state
    const request = `${urlApi}?${apiKey}&query=${searchQuery}&page=${page}&guest_session_id=${guestSessionId}`
    try {
      const response = await fetch(request)
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных')
      }
      const data = await response.json()
      const totalPages = data.total_pages
      this.setState({ totalPages })
      if (data.results.length === 0) {
        this.setState({ noResults: true, movies: [], error: null })
      } else {
        const movies = data.results
        const moviesWithGenres = await Promise.all(movies.map(async movie => {
          const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?${apiKey}`)
          if (!movieDetailsResponse.ok) {
            throw new Error('Ошибка при получении информации о фильме')
          }
          const movieDetails = await movieDetailsResponse.json()
          return {
            ...movie,
            genres: movieDetails.genres.map(genre => genre.id),
          }
        }))
        this.setState({ movies: moviesWithGenres, noResults: false, error: null })
      }
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  renderMovies = () => {
    const { movies, noResults, error } = this.state

    if (error) {
      return (
        <div className='error'>
          <Alert message={error} type="error" />
        </div>
      )
    } if (noResults) {
      return (
        <div className='no-results'>
          <Alert message="Нет результатов поиска" type="warning" />
        </div>
      )
    } 
    return (
      <div>
        <div className='movies'>
          {movies.map(movie => (
            <Movie 
              key={movie.id}
              id={movie.id} 
              posterPath={movie.poster_path} 
              title={movie.title} 
              releaseDate={movie.release_date} 
              overview={movie.overview}
              movieGenres={movie.genres}
              movieId={movie.movieId}
              rateMovie={this.rateMovie}
            />
          ))}
        </div>
      </div>
    )
    
  }

  renderRatedMovies = () => {
    const { ratedMovies } = this.state
    const moviesPerPage = 20
    const pages = Math.ceil(ratedMovies.length / moviesPerPage)

    if (!ratedMovies || ratedMovies.length === 0) {
      return <Empty description="Нет оцененных фильмов"/>
    }

    return (
      <div>
        <div className='movies'>
          {ratedMovies.map(movie => (
            movie ? (
              <Movie 
                key={movie.id}
                id={movie.id} 
                posterPath={movie.poster_path} 
                title={movie.title} 
                releaseDate={movie.release_date} 
                overview={movie.overview}
                movieGenres={movie.genres}
                rating={movie.rating}
                // movieId={movie.movieId}
                // rateMovie={this.rateMovie}
                // rateMovie={this.rateMovie}
              />
            ) : null
          ))}
        </div>
        <div className="footer__wrapper">
          <Pagination 
            current={pages}
            defaultCurrent={1}
            showSizeChanger={false}
            total={pages > 0 ? pages  : 1}
          />
        </div>
      </div>
    )
  }

  render() {
    const { totalPages } = this.state
    
    return (
      <section className='container'>
        <Tabs className='Tabs' defaultActiveKey="1">
          <TabPane tab="Search" key="1">
            <Search handlerSearchQuery={this.handlerSearchQuery} />
            {this.renderMovies()}
            <Footer 
            
              onPageChange={this.handlePageChange}
              totalPages={totalPages}
            />
          </TabPane>
          <TabPane tab="Rated" key="2">
            {this.renderRatedMovies()}
          </TabPane>
        </Tabs>
      </section>
    )
  }
}

export default App