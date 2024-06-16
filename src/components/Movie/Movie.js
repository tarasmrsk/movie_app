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
//       };

//     return (
//         <div className='movie'>
//             <img src={poster_path ? `${imageUrl}${poster_path}` : noImage} alt={title} />
//             <div className='movie__column'>
//                 <div className='title__wrapper'>
//                     <h3 className='movie__title'>{title}</h3>
//                     <div className='movie__circle'>
//                         <span className='movie__rating'>{rating}</span>
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
//                     <MovieRate onRatingChange={handleRatingChange}/>
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

function Movie({ id, poster_path, title, release_date, overview }) {
    const [isLoading, setIsLoading] = useState(true);
    const truncatedOverview = truncateText(overview, 250);
    const imageUrl = `https://image.tmdb.org/t/p/w500`;
    const [rating, setRating] = useState(0.0);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <Spin size="large" />;
    }

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    return (
        <div className='movie'>
            <img src={poster_path ? `${imageUrl}${poster_path}` : noImage} alt={title} />
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
                <ul className='movie__genres'>
                    <li>Action</li>
                    <li>Drama</li>
                </ul>
                {release_date && (
                    <h5 className='movie__date'>
                        {format(new Date(release_date), 'MMMM dd, yyyy', { locale: enGB })}
                    </h5>
                )}
                <p className='movie__overview'>{truncatedOverview}</p>
                <div className='movie_stars'>
                    <MovieRate onRatingChange={handleRatingChange} />
                </div>
            </div>
        </div>
    );
}

export default Movie;
