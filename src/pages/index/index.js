'use strict';

import React, { Component } from 'react';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount = () => {};

	render = () => {
		const { props } = this;
		return (
			<>
				<props.theme.layout.Wrap>
					<props.theme.typography.H1>Hangman</props.theme.typography.H1>
				</props.theme.layout.Wrap>
			</>
		);
	};
}

export default Home;
