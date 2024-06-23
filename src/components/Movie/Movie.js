// import React, { useState, useEffect } from 'react';
// import './Movie.css';
// import { format } from 'date-fns';
// import { enGB } from 'date-fns/locale';
// import noImage from './no_image.png';
// import { Spin } from 'antd';
// import MovieRate from '../MovieRate';

// function truncateText(text, maxLength) {
//     if (text.length <= maxLength) {
//         return text;
//     }
    
//     const truncated = text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
//     return truncated;
// }

// function Movie({ id, poster_path, title, release_date, overview }) {
//     const [isLoading, setIsLoading] = useState(true);
//     const truncatedOverview = truncateText(overview, 250);
//     const imageUrl = `https://image.tmdb.org/t/p/w500`;
//     const [rating, setRating] = useState(0.0);

//     useEffect(() => {
//         setIsLoading(false);
//     }, []);

//     if (isLoading) {
//         return <Spin size="large" />;
//     }

//     const handleRatingChange = (newRating) => {
//         setRating(newRating);
//     };

//     return (
//         <div className='movie'>
//             <img className='poster__img' src={poster_path ? `${imageUrl}${poster_path}` : noImage} alt={title} />
//             <div className='movie__column'>
//                 <div className='title__wrapper'>
//                     <h3 className='movie__title'>{title}</h3>
//                     <div className='movie__circle' style={{ borderColor: 
//                         rating >= 7 ? '#66E900' : 
//                         rating >= 5 ? '#E9D100' : 
//                         rating >= 3 ? '#E97E00' : 
//                         '#E90000'
//                     }}>
//                         <span className='movie__rating'>{rating === 10 ? '10' : Number(rating).toFixed(1)}</span>
//                     </div>
//                 </div>
//                 <ul className='movie__genres'>
//                     <li>Action</li>
//                     <li>Drama</li>
//                 </ul>
//                 {release_date && (
//                     <h5 className='movie__date'>
//                         {format(new Date(release_date), 'MMMM dd, yyyy', { locale: enGB })}
//                     </h5>
//                 )}
//                 <p className='movie__overview'>{truncatedOverview}</p>
//                 <div className='movie_stars'>
//                     <MovieRate onRatingChange={handleRatingChange} />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Movie;


import React, { useState, useEffect } from 'react';
import './Movie.css';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import noImage from './no_image.png';
import { Spin } from 'antd';
import MovieRate from '../MovieRate';

function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    
    const truncated = text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
    return truncated;
}

const apiKey = 'api_key=2a1aa5d98370a138c9bf04a4064f7e6f';

function Movie({ id, poster_path, title, release_date, overview, movieGenres }) {
    const [isLoading, setIsLoading] = useState(true);
    const truncatedOverview = truncateText(overview, 100);
    const imageUrl = 'https://image.tmdb.org/t/p/w500';
    const [rating, setRating] = useState(0.0);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`)
            .then(response => response.json())
            .then(data => {
                setGenres(data.genres);
                setIsLoading(false);
            })
            .catch(error => console.error('Error fetching genres:', error));
    }, []);

    if (isLoading) {
        return <Spin size="large" />;
    }

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        sendRatingToServer(newRating);
    };

    // const sendRatingToServer = (newRating) => {
    //     const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTFhYTVkOTgzNzBhMTM4YzliZjA0YTQwNjRmN2U2ZiIsInN1YiI6IjY2NWRjZWJkNmJlOTk3YzA3YmEwZGU0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hYheqwmAHBAk6HFKShbJJxW4SALwyOYCZ7UN4v-j_jU';
    
    //     fetch(`https://api.themoviedb.org/3/movie/${id}/rating`, {
    //         method: 'POST',
    //         body: JSON.stringify({ value: newRating }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //     })
    //     .then(response => {
    //         console.log('Оценка через гостевую');
    //         console.log(id);
    //         if (response.ok) {
    //             console.log('Rating submitted successfully');
    //         } else {
    //             console.error('Failed to submit rating');
    //         }
    //     })
    //     .catch(error => console.error('Error submitting rating:', error));
    // };

    const sendRatingToServer = (newRating) => {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTFhYTVkOTgzNzBhMTM4YzliZjA0YTQwNjRmN2U2ZiIsInN1YiI6IjY2NWRjZWJkNmJlOTk3YzA3YmEwZGU0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hYheqwmAHBAk6HFKShbJJxW4SALwyOYCZ7UN4v-j_jU';
    
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ value: newRating })
        };
    
        fetch(`https://api.themoviedb.org/3/movie/${id}/rating`, options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to submit rating');
            })
            .then(data => console.log(data))
            .catch(error => console.error('Error submitting rating:', error));
    };

    return (
        <div className='movie'>
            <img className='poster__img' src={poster_path ? `${imageUrl}${poster_path}` : noImage} alt={title} />
            <div className='movie__column'>
                <div className='title__wrapper'>
                    <h3 className='movie__title'>{title}</h3>
                    <div className='movie__circle' style={{ borderColor: 
                        rating >= 7 ? '#66E900' : 
                        rating >= 5 ? '#E9D100' : 
                        rating >= 3 ? '#E97E00' : 
                        '#E90000'
                    }}>
                        <span className='movie__rating'>{rating === 10 ? '10' : Number(rating).toFixed(1)}</span>
                    </div>
                </div>
                {release_date && (
                    <h5 className='movie__date'>
                        {format(new Date(release_date), 'MMMM dd, yyyy', { locale: enGB })}
                    </h5>
                )}
                <ul className='movie__genres'>
                {movieGenres.map(genreId => {
                    const genre = genres.find(g => g.id === genreId);
                    return <li key={genre.id}>{genre.name}</li>;
                })}
                </ul>
                <p className='movie__overview'>{truncatedOverview}</p>
                <div className='movie_stars'>
                    <MovieRate onRatingChange={handleRatingChange} />
                </div>
            </div>
        </div>
    );
}

export default Movie;