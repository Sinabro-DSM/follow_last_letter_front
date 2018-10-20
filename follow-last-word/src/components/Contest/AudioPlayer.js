import React, { Component } from 'react'
import './AudioPlayer.css'

export default class AudioPlayer extends Component {
  constructor(props) {
		super(props);

		this.state = {
			control: true,
			autoPlay: true
		}
	}
  
  render() {
    return (
      <audio className="recordedAudio" src={this.props.audioSrc} controls={this.state.control} autoPlay={this.state.autoPlay}/>
    )
  }
}
