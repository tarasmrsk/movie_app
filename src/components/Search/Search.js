// import React, { Component } from 'react';
// import './Search.css';

// class Search extends Component {
//     state = {
//         searchQuery: ''
//     };

//     handleSearchInputChange = (event) => {
//         this.setState({ searchQuery: event.target.value });
    
//         if (this.timeout) {
//             clearTimeout(this.timeout); 
//         }
    
//         this.timeout = setTimeout(() => {
//             this.performSearch();
//         }, 500);
//     };

//     performSearch = () => {
//         this.setState({ isSearching: true });
//         const apiKey = '2a1aa5d98370a138c9bf04a4064f7e6f';
//         const baseUrl = 'https://api.themoviedb.org/3/search/movie';
//         const { searchQuery } = this.state;

//         const url = `${baseUrl}?api_key=${apiKey}&query=${searchQuery}`;
    
//         fetch(url)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Search results:', data.results);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
            
//     };

//     render() {
//         return (
//             <div className="search-container">
//                 <input
//                     className="search-input"
//                     type="text"
//                     value={this.state.searchQuery}
//                     onChange={this.handleSearchInputChange}
//                     placeholder="Type to search..."
//                 />
//             </div>
//         );
//     }
// }

// export default Search;


import React, { Component } from 'react';
import { Input } from 'antd';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  render() {
    const { handleSubmit, handleChange, handlerSearchQuery } = this.props;
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="input__wrapper">
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Type to search..."
            onChange={handlerSearchQuery}
          />
        </form>
      </div>
    );
  }
}