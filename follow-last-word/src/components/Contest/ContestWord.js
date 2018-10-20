import React, { Component } from 'react';
import classeNames from 'classnames';
import styles from './ContestWord.css'
const cx = classeNames.bind(styles);


export default class ContestWord extends Component {
	constructor(props) {
		super(props);
		this.state = {
			classeNames: {
				'contest-word': true,
				'contest-wrong-word': false
			}
		}
	}

	componentDidMount() {
	}

	render() {
		return (
			<span className={cx('contest-word', {'contest-worng-word': this.props.isWrongWord})}>{this.props.word}</span>
		);
	}
}