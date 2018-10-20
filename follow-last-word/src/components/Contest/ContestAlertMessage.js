import React, { Component } from 'react'
import './ContestAlertMessage.css'

export default class ContestAlertMessage extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="contest-alert-message">
				<h2>{this.props.errorMessage}</h2>
			</div>
		)
	}
}