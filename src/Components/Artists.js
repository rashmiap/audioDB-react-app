import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';

class Artists extends Component {
  constructor(props){
    super(props);
    this.state = {
      artistsList: [],
      userSearched: '',
      isLoading: false,
      error: null,
    };
  }
  __handleUserChange = event => {
    this.setState({
      userSearched: event.target.value,
    })
  }
  __fetchArtists(){
    const { userSearched } = this.state;
    this.setState({ isLoading: true });
    fetch(`http://www.theaudiodb.com/api/v1/json/1/search.php?s=${userSearched}`)
    .then(response => {
      if(response.ok){
        return response.json();
      }
      else{
        throw new Error('Something went wrong ...');
      }
    }).then(data => {
        this.setState({
          userSearched: '',
          artistsList: data.artists,
          isLoading: false
        })
    })
    .catch(error => this.setState({ error, isLoading: false, userSearched: ''}));
  }
  __renderArtists(){
    const { artistsList } = this.state;
    let renderArtistBlock = [];
    renderArtistBlock = artistsList !== null ?
     artistsList.map(item => {
       const MyLink = (props) => <Link to={{ pathname: `/albums/${item.strArtist}`, state: { artistdata: item} }}  {...props}  />
       return (
        <div key={item.idArtist} className="Artists-results">
          <div style={Object.assign({ backgroundImage:`url(${item.strArtistThumb})`})} className="Artists-results__header">
            &nbsp;
          </div>
          <div className="Artists-results__info">
            <h3 className="name">{item.strArtist}</h3>
            <Button size="small" color="secondary" component={MyLink}>
              See More
            </Button>
          </div>
        </div>
       );
     })
     : <p>oops! No artist found</p>;
    return renderArtistBlock;
  }
  render() {
    const { userSearched, isLoading, error } = this.state;
    if(error){
      return <div className="Artists">
              <p>{error.message}</p>
            </div>;
    }

    if(isLoading){
      return <div className="Artists">
                <CircularProgress  color="secondary"/>
              </div>;
    }

    return (
      <section className="Artists">
        <form noValidate autoComplete="off" className="Artists-form">
          <TextField
            id="artist"
            label="Artist name"
            value={userSearched}
            onChange={this.__handleUserChange}
            margin="normal"
            fullWidth={true}
          />
          <Button variant="contained" color="secondary" onClick={this.__fetchArtists.bind(this)} type="submit">
            Search
          </Button>
        </form>
        {this.__renderArtists()}
      </section>
    );
  }
}
export default Artists;
