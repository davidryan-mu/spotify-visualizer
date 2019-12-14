import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch';
import backgroundSketch from './backgroundSketch';
import logo from './logo_black.png';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

import Spotify from 'spotify-web-api-js';

const spotifyWebAPI = new Spotify();

export default class App extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: "Nothing Playing",
        artist: "",
        image: "",
        id: "",
        loudness_response: {},
        current_loudness: 0,
        isPlaying: false
      }
    }
    if(params.access_token) {
      spotifyWebAPI.setAccessToken(params.access_token);
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      spotifyWebAPI.getMyCurrentPlaybackState()
      .then((response) => {
        if(response) {
          this.setState({
            nowPlaying: {
              name: response.item.name,
              artist: response.item.artists[0].name,
              image: response.item.album.images[0].url,
              id: response.item.id,
              loudness_response: this.state.nowPlaying.loudness_response,
              current_loudness: this.state.nowPlaying.current_loudness,
              isPlaying: response.is_playing
            }
          })
          console.log(response);
        }
      })
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.interval1);
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.nowPlaying.id !== this.state.nowPlaying.id || nextState.nowPlaying.isPlaying !== this.state.nowPlaying.isPlaying) {
      spotifyWebAPI.getAudioAnalysisForTrack(nextState.nowPlaying.id)
      .then((response) => {
        if(response) {
            this.setState({
              nowPlaying: {
                name: this.state.nowPlaying.name,
                artist: this.state.nowPlaying.artist,
                image: this.state.nowPlaying.image,
                id: nextState.nowPlaying.id,
                loudness_response: response,
                current_loudness: this.state.nowPlaying.current_loudness,
                isPlaying: nextState.nowPlaying.isPlaying
              }
            })
        }
      })
      .then(() => {
        let i = 0;
            this.interval1 = setInterval(() => {
              this.setState({
                nowPlaying: {
                  name: this.state.nowPlaying.name,
                  artist: this.state.nowPlaying.artist,
                  image: this.state.nowPlaying.image,
                  id: this.state.nowPlaying.id,
                  loudness_response: this.state.nowPlaying.loudness_response,
                  current_loudness: this.state.nowPlaying.loudness_response.segments[i].loudness_max,
                  isPlaying: this.state.nowPlaying.isPlaying
                }
              })
              if(i < this.state.nowPlaying.loudness_response.segments.length - 10)
                i++;
            }, 100);
      })
    }
  }

  render() {
      return (
        <div className="App">
          {this.state.loggedIn ?
            <div>

              <div style={{position: "absolute", left: "10px", bottom: "10px"}}>
                <img src={this.state.nowPlaying.image} style={{width: "200px", display: "inline-block"}}/>
                <div style={{display: "inline-block", paddingLeft: "10px"}}>
                  <h1><span style={{backgroundColor: "#000", color: "#fff", paddingLeft: "10px", paddingRight: "10px", float: "left"}}>{this.state.nowPlaying.name}</span></h1>
                  <br /> <br />
                  <h4><span style={{backgroundColor: "#000", color: "#fff", paddingLeft: "5px", paddingRight: "5px", float: "left"}}>{this.state.nowPlaying.artist}</span></h4>
                </div>
              </div>

              <P5Wrapper sketch={sketch} loudness={this.state.nowPlaying.current_loudness} isPlaying={this.state.nowPlaying.isPlaying}/>
            </div>
            :
            <div>
              <div style={{position: "fixed", top: "50%", left: "50%", marginTop: "-200px", marginLeft: "-170px"}}>
                <img src={logo} alt="Logo" width="250px" style={{marginBottom: "15px"}}/>
                <h1><span style={{backgroundColor: "#000", color: "#fff", paddingLeft: "10px", paddingRight: "10px"}}>Spotify Visualizer</span></h1>
                <br/ >
                <Button variant="success" size="lg" href="http://localhost:8888">Login With Spotify</Button>
              </div>

              <P5Wrapper sketch={backgroundSketch} />
            </div>
          }
        </div>
      );
  }
}