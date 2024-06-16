import React from 'react';
import _ from 'lodash';
import './App.css';
import Movie from '../Movie';
import Search from '../Search';
import Footer from '../Footer';
import { Alert } from 'antd';
import Header from '../Header';

class App extends React.Component {
  state = {
    movies: [],
    searchQuery: '',
    url_api: 'https://api.themoviedb.org/3/search/movie',
    api_key: 'api_key=2a1aa5d98370a138c9bf04a4064f7e6f',
    page: 1,
    noResults: false,
    error: null,
  };

  handlePageChange = (page) => {
    this.setState({ page }, () => {
      this.getMovies();
    });
  };

  handlerSearchQuery = _.debounce((e) => {
    this.setState({ searchQuery: e.target.value }, () => {
      console.log(this.state.searchQuery);
      this.getMovies();
    });
  }, 600);

  getMovies = async () => {
    const request = `${this.state.url_api}?${this.state.api_key}&query=${this.state.searchQuery}&page=${this.state.page}`;
    try {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных');
      }
      const data = await response.json();
      if (data.results.length === 0) {
        this.setState({ noResults: true, movies: [], error: null });
      } else {
        const movies = data.results;
        this.setState({ movies, noResults: false, error: null });
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const { movies, noResults, error } = this.state;
    return (
      <section className='container'>
        <Header />
        <Search handlerSearchQuery={this.handlerSearchQuery} />
        {error ? (
          <div className='error'>
            <Alert message={error} type="error" />
          </div>
        ) : noResults ? (
          <div className='no-results'>
            <Alert message="Нет результатов поиска" type="warning" />
          </div>
        ) : (
          <div>
            <div className='movies'>
              {movies.map(movie => (
                <Movie 
                  key={movie.id}
                  id={movie.id} 
                  poster_path={movie.poster_path} 
                  title={movie.title} 
                  release_date={movie.release_date} 
                  overview={movie.overview}
                />
              ))}
            </div>
          </div>
        )}
        <Footer onPageChange={this.handlePageChange} />
      </section>
    );
  }
}

export default App;