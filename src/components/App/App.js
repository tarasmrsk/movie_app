import React from 'react';
import _ from 'lodash';
import './App.css';
import Movie from '../Movie';
import Search from '../Search';
import Footer from '../Footer';
import { Alert, Empty, Tabs } from 'antd';
const { TabPane } = Tabs;

class App extends React.Component {
  state = {
    movies: [],
    ratedMovies: [],
    searchQuery: '',
    url_api: 'https://api.themoviedb.org/3/search/movie',
    api_key: 'api_key=2a1aa5d98370a138c9bf04a4064f7e6f',
    guest_session: 'https://api.themoviedb.org/3/authentication/guest_session/new',
    page: 1,
    noResults: false,
    error: null,
    guestSessionId: null,
  };

  getGuestSession = async () => {
    const { guest_session, api_key } = this.state;
    try {
      const response = await fetch(`${guest_session}?${api_key}`);
      if (!response.ok) {
        throw new Error('Ошибка при создании гостевой сессии');
      }
      const data = await response.json();
      console.log(data.guest_session_id)
      this.setState({ guestSessionId: data.guest_session_id });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };
  
  componentDidMount() {
    if (!this.state.guestSessionId) {
      this.getGuestSession().then(() => {
        this.getRatedMovies();
      });
    } else {
      this.getRatedMovies();
    }
  }

  // getRatedMovies = async () => {
  //   const { api_key, guestSessionId } = this.state;
  //   if (!guestSessionId) {
  //       return;
  //   }
  //   const request = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?${api_key}&
  //   language=en-US&page=1&sort_by=created_at.asc`;

  //   try {
  //       const response = await fetch(request, {
  //           method: 'GET',
  //           headers: {
  //               accept: 'application/json'
  //           }
  //       });

  //       if (!response.ok) {
  //           throw new Error('Ошибка при загрузке оцененных фильмов');
  //       }

  //       const data = await response.json();
  //       const ratedMovies = data.results;
  //       console.log(ratedMovies)

  //       this.setState(prevState => ({
  //           ratedMovies: [...prevState.ratedMovies, ...ratedMovies],
  //           error: null
  //       }));
  //   } catch (error) {
  //       this.setState({ error: error.message });
  //   }
  // };

  getRatedMovies = async () => {
    const { api_key, guestSessionId } = this.state;
    if (!guestSessionId) {
        return;
    }

    const request = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?${api_key}&
  //   language=en-US&page=1&sort_by=created_at.asc`;

    try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTFhYTVkOTgzNzBhMTM4YzliZjA0YTQwNjRmN2U2ZiIsInN1YiI6IjY2NWRjZWJkNmJlOTk3YzA3YmEwZGU0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hYheqwmAHBAk6HFKShbJJxW4SALwyOYCZ7UN4v-j_jU';
        const response = await fetch(request, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при загрузке оцененных фильмов');
        }

        const data = await response.json();
        const ratedMovies = data.results;
        console.log(ratedMovies);

        this.setState(prevState => ({
            ratedMovies: [...prevState.ratedMovies, ...ratedMovies],
            error: null
        }));
    } catch (error) {
        this.setState({ error: error.message });
    }
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
    const { url_api, api_key, searchQuery, page, guestSessionId } = this.state;
    const request = `${url_api}?${api_key}&query=${searchQuery}&page=${page}&guest_session_id=${guestSessionId}`;
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
        const moviesWithGenres = await Promise.all(movies.map(async movie => {
          const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?${api_key}`);
          if (!movieDetailsResponse.ok) {
            throw new Error('Ошибка при получении информации о фильме');
          }
          const movieDetails = await movieDetailsResponse.json();
          return {
            ...movie,
            genres: movieDetails.genres.map(genre => genre.id),
          };
        }));
        this.setState({ movies: moviesWithGenres, noResults: false, error: null });
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  renderMovies = () => {
    const { movies, noResults, error } = this.state;

    if (error) {
      return (
        <div className='error'>
          <Alert message={error} type="error" />
        </div>
      );
    } else if (noResults) {
      return (
        <div className='no-results'>
          <Alert message="Нет результатов поиска" type="warning" />
        </div>
      );
    } else {
      return (
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
                movieGenres={movie.genres}
              />
            ))}
          </div>
        </div>
      );
    }
  }

  renderRatedMovies = () => {
    const { ratedMovies } = this.state;

    if (ratedMovies.length > 0) {
        return ratedMovies.map(movie => (
            <Movie key={movie.id} {...movie} />
        ));
    } else {
        return <Empty description="Нет оцененных фильмов"/>;
    }
  };

  render() {
    return (
      <section className='container'>
        <Tabs className='Tabs' defaultActiveKey="1">
          <TabPane tab="Search" key="1">
            <Search handlerSearchQuery={this.handlerSearchQuery} />
            {this.renderMovies()}
          </TabPane>
          <TabPane tab="Rated" key="2">
            {this.renderRatedMovies()}
          </TabPane>
        </Tabs>
        <Footer onPageChange={this.handlePageChange} />
      </section>
    );
  }
}

export default App;