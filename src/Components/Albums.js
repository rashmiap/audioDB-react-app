import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

class Albums extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      error: false,
      albumList: [],
      artistdata: this.props.location.state.artistdata,
    }
  }
  componentDidMount(){
    this.setState({ isLoading: true });
    fetch(`http://www.theaudiodb.com/api/v1/json/1/searchalbum.php?s=${this.props.match.params.artistName}`)
    .then(response => {
      if(response.ok){
        return response.json();
      }
      else{
        throw new Error('Something went wrong in fetching album information...');
      }
    }).then(data => {
        this.setState({
          albumList: data.album,
          isLoading: false
        })
    })
    .catch(error => this.setState({ error, isLoading: false }));
  }
  render() {
    const { isLoading, error, artistdata } = this.state;
    if(error){
      return <div className="Albums">
              <p>{error.message}</p>
            </div>;
    }

    if(isLoading){
      return <div className="Albums">
                <CircularProgress  color="secondary"/>
              </div>;
    }
    return (
      <section className="Albums">
        <div className="Albums-artist">
          <div style={{backgroundImage: `url(${artistdata.strArtistThumb})`}} className="Albums-artist__thumbnail">
            &nbsp;
          </div>
          <h3>{artistdata.strArtist}</h3>
        </div>
      </section>
    );
  }
}
export default Albums;
