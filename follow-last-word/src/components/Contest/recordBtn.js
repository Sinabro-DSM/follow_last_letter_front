import React, { Component } from 'react'
import './recordBtn.css'

export default class recordBtn extends Component {
  render() {
    return (<button onClick={this.props.toggleFunc} className="record-btn"></button>)
  }
}
