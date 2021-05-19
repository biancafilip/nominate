import React from 'react';
import axios from 'axios';
import '../SearchBar.css';

class SearchBar extends React.Component {

    constructor( props ) {
        super( props );
        
        this.state = {
            query: '',
            results: {},
            //loading button, may or may not use
            loading: false,
            //message to user, if an error etc
            message: ''
        }

        this.cancel = '';
    }

    fetchSearchResults = ( query ) => {
        const searchURL = `http://www.omdbapi.com/?t=${query}&apikey=a193c6c`

        if( this.cancel ) {
            //cancel previous request before making new one
            this.cancel.cancel();
        }
        // create new CancelToken
        this.cancel = axios.CancelToken.source();

        axios.get( searchURL, {
            cancelToken: this.cancel.token 
        } )
            .then( ( res ) => {
                console.warn( res.data );
                const resultNotFoundMsg = !res.data.Response ? 'Movie not found. Please try a new search' : '';

                this.setState({
                    results: res.data,
                    message: resultNotFoundMsg,
                    loading: false
                });
            })
            .catch( error => {
                if ( axios.isCancel(error) || error ) {
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch data. Please check network'
                    });
                }
            });
    };

    handleOnInputChange = ( event ) => {
        const query  = event.target.value;

        if ( !query ) {
            this.setState({query, results: {}, message: '' });
        } else {
            this.setState( { query: query, loading: true, message: '' }, () => {
                this.fetchSearchResults( query );
            });
        }
    };

    renderSearchResults = () => {
        const {results} = this.state;
        //console.warn(results.data);

        //might have to change results.length
        if (Object.keys(results).length) {
            return (
                <div className="results-container">
                    {results.split(', ').map((result) => {
                        return (
                            <li key={result.imdbID} className="result-items">
                                <h6 className="movie-title">{result.Title}</h6>
                                <h6 className="movie-year">{result.Year}</h6>
                            </li>
                        );
                    })}
                </div>
            );
        }
    };

    render() {
        const { query } = this.state;

        return (
            <div className="container">
            <h2 className="heading"> Build your list of favorite movies! Search a movie below.. </h2>
            <label className="search-label" htmlFor="search-input">
                <input
                    type="text"
                    name="query"
                    value={query}
                    id="search-input"
                    placeholder="Search"
                    onChange={this.handleOnInputChange}
                />
                <i className="fa fa-search search-icon" aria-hidden="true"/>
            </label>
                { this.renderSearchResults() }
            </div>
        )
    }
};

export default SearchBar