'use strict';

/*
	TODO:
		* Give up
		* show guessed chars
		* Win/lose feedback
		* Draw stickman
		* Clues (API call)
			- Director / year / top actor/actress / awards
		* Link to IMDB on game over
*/

import React, { Component } from 'react';
import Loading from '~/components/loading';
import VisuallyHidden from '~/components/visually-hidden';
import { get } from '~/api';

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
			remainingGuesses: 11,
			gameWon: false,
			gameLost: false,
		};
		this.solveInput = React.createRef();
	}

	componentDidMount = () => {
		this.setAnswer();
		this.addEventListeners();
	};

	setAnswer = async () => {
		const data = await get(`movie/top_rated?api_key=${process.env.API_KEY}`);
		const results = data.data.results;
		const answer = results[Math.floor(Math.random() * results.length)].title;
		const answerArray = answer.split('');
		const answerArrayObfuscated = [];
		answerArray.forEach((char) => {
			const newChar = char === ' ' ? char : '*';
			answerArrayObfuscated.push(newChar);
		});
		this.setState({ answer, answerArray, answerArrayObfuscated });
	};

	validateKeyPress = (e) => {
		const char = e.key;
		const isValidCharacter = PERMITTED_CHARACTERS.includes(char);
		const solveInputHasFocus = document.activeElement === this.solveInput.current;
		if (!isValidCharacter || solveInputHasFocus) return;
		this.checkCharacter(char);
		this.updateRemainingGuesses();
	};

	checkCharacter = (char) => {
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

	updateRemainingGuesses = () => {
		const currentVal = this.state.remainingGuesses;
		const newVal = currentVal - 1;
		this.setState({ remainingGuesses: newVal });
		if (newVal === 0) {
			this.revealAnswer();
			this.setState({ gameLost: true });
		}
	};

	addEventListeners = () => {
		document.addEventListener('keyup', (e) => this.validateKeyPress(e));
	};

	revealAnswer = () => {
		this.setState({ answerArrayObfuscated: this.state.answerArray });
	};

	validateGuess = (e) => {
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		if (this.solveInput.current.value.toLowerCase() === this.state.answer.toLowerCase()) {
			this.revealAnswer();
			this.setState({ gameWon: true });
		}
	};

	render = () => {
		const { props, state } = this;
		if (!state.answerArrayObfuscated) return <Loading />;
		return (
			<>
				<props.theme.layout.Wrap>
					<props.theme.typography.H1>
						{state.answerArrayObfuscated.map((char, index) => {
							return <span key={index}>{char}</span>;
						})}
					</props.theme.typography.H1>
					{!state.gameLost && !state.gameWon && (
						<>
							<p>
								You have <strong>{state.remainingGuesses}</strong>{' '}
								{`${state.remainingGuesses > 1 ? 'guesses' : 'guess'}`} left
							</p>
							<form onSubmit={(e) => this.validateGuess(e)}>
								<VisuallyHidden>
									<label htmlFor="solve">Solve it!</label>
								</VisuallyHidden>
								<input ref={this.solveInput} type="text" id="solve" name="solve" />
								<input type="submit" value="Solve it!" />
							</form>
						</>
					)}
					{state.gameLost && (
						<p>
							Lost! <a href="/">Play again?</a>
						</p>
					)}
					{state.gameWon && (
						<p>
							Won! <a href="/">Play again?</a>
						</p>
					)}
				</props.theme.layout.Wrap>
			</>
		);
	};
}

export default Home;
