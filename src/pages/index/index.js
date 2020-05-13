'use strict';

import React, { Component } from 'react';
import Loading from '~/components/loading';

// const NUMBER_OF_PERMITTED_GUESSES = 11;

const PERMITTED_CHARACTERS = [
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'0',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
];

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			guessesTaken: 0,
			gameWon: false,
			gameLost: false,
			hasReachGuessLimit: false,
		};
	}

	componentDidMount = () => {
		const answer = 'The Godfather'; // Replace with API call to fetch random movie
		const answerArray = answer.split('');
		const answerArrayObfuscated = [];
		answerArray.forEach((char) => {
			const newChar = char === ' ' ? char : '*';
			answerArrayObfuscated.push(newChar);
		});
		this.setState({ answer, answerArray, answerArrayObfuscated });
		this.addEventListeners();
	};

	validateKeyPress = (e) => {
		const char = e.key;
		const isValidCharacter = PERMITTED_CHARACTERS.includes(char);
		if (!isValidCharacter) return;
		this.checkCharacter(char);
	};

	checkCharacter = (char) => {
		this.incrementGuessCount();
		if (
			!this.state.answerArray.includes(char.toLowerCase()) &&
			!this.state.answerArray.includes(char.toUpperCase())
		)
			return;
		const newArray = this.state.answerArrayObfuscated;
		this.state.answerArray.forEach((answerChar, index) => {
			if (this.state.answerArray[index].toLowerCase() === char.toLowerCase())
				newArray[index] = this.state.answerArray[index];
		});
		this.setState({ answerArrayObfuscated: newArray });
	};

	incrementGuessCount = () => {};

	addEventListeners = () => {
		document.addEventListener('keyup', (e) => this.validateKeyPress(e));
	};

	revealAnswer = () => {
		this.setState({ answerArrayObfuscated: this.state.answerArray });
	};

	render = () => {
		const { props, state } = this;
		if (!state.answerArrayObfuscated) return <Loading />;
		return (
			<>
				<props.theme.layout.Wrap>
					<props.theme.typography.H1>Movie Hangman</props.theme.typography.H1>
					{state.hasReachGuessLimit && <p>Game over!</p>}
					{state.answerArrayObfuscated.map((char, index) => {
						return <span key={index}>{char}</span>;
					})}
				</props.theme.layout.Wrap>
			</>
		);
	};
}

export default Home;
