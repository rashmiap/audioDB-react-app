import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import tone from '../Assets/tone.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';

class TrackRecord extends Component {
  constructor(props){
    super(props);
    this.state = {
      openDialog: false,
      isLoading: false,
      error: null,
      trackList: [],
    };
  }
  __handleDialogOpen(){
    this.setState({
      openDialog: true,
      isLoading: true,
    });
    fetch(`http://www.theaudiodb.com/api/v1/json/1/track.php?m=${this.props.albumId}`)
    .then(response => {
      if(response.ok){
        return response.json();
      }
      else{
        throw new Error('Something went wrong in fetching track details...');
      }
    }).then(data => {
        this.setState({
          trackList: data.track,
          isLoading: false
        })
    })
    .catch(error => this.setState({ error, isLoading: false}));
  };

  __handleDialogClose = () => {
    this.setState({
      openDialog: false,
    })
  }
  __renderTracks(){
    const { trackList, error, isLoading } = this.state;
    let renderTrackBlock = [];
    if(error){
      return <div className="Track-error">
              <p>{error.message}</p>
            </div>;
    }

    if(isLoading){
      return <div className="Track-error">
                <CircularProgress  color="secondary" />
              </div>;
    }
    renderTrackBlock = trackList !== null ?
     trackList.map(item => {
       return (
        <div key={item.idTrack} className="Track">
          <p className="Track-duration">{item.strTrack}: <span>{item.intDuration} microsec</span></p>
        </div>
       );
     })
     : <p>oops! No tracks found</p>;
    return renderTrackBlock;
  }
  render() {
    const { openDialog, trackList } = this.state;
    return (
      <div className="Albums-results">
        <div className="Albums-results__header">
          <img src={tone} alt="music tone" width="65px"/>
        </div>
        <div className="Albums-results__info">
          <p className="name">{this.props.albumName}</p>
          <Button size="small" color="secondary" variant="contained" onClick={this.__handleDialogOpen.bind(this)}>
            View tracks
          </Button>
        </div>
        <Dialog onClose={this.__handleDialogClose} open={openDialog} className="Albums-results__dialog" maxWidth={'lg'}>
          { trackList ? trackList.length > 0 ?
            <div className="Track-header">
              <h3>{this.props.albumName}</h3>
              <p>{this.props.releaseYear}</p>
              <img src={tone} alt="music note"/>
            </div> : '' : ''}
            <DialogContent>
              {this.__renderTracks()}
            </DialogContent>
        </Dialog>
      </div>
    )
  }
}
TrackRecord.propTypes = {
  albumName: PropTypes.string,
  albumId: PropTypes.string,
  releaseYear: PropTypes.string,
};
export default TrackRecord;