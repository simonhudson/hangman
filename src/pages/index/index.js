'use strict';

/*
	TODO:
		* Give up
		* show guessed chars
		* Draw stickman
*/

import React, { Component } from 'react';
import Loading from '~/components/loading';
import VisuallyHidden from '~/components/visually-hidden';
import { get } from '~/api';
import { Image } from './index.styles';

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

const OBFUSCATED_CHARACTER = '_';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			remainingGuesses: 11,
			gameWon: false,
			gameLost: false,
			gameOver: false,
			remainingClues: 3,
			clues: {},
			isLoading: true,
		};
		this.solveInput = React.createRef();
	}

	componentDidMount = () => {
		this.setAnswer();
		this.addEventListeners();
	};

	setAnswer = async () => {
		get(`get-top-rated-movies`).then((response) => {
			let { data } = response;
			data = data.slice(0, 50);
			const answer = data[Math.floor(Math.random() * data.length)];
			const id = answer.id.split('/')[2];
			this.setState({ answerId: id });
			get(`get-overview-details?tconst=${id}`).then((response) => {
				const { data } = response;
				let title = data.title.title;
				const year = data.title.year;
				const genres = data.genres;
				const image = data.title.image.url;
				const answerArray = title.split('');
				const answerArrayObfuscated = [];
				answerArray.forEach((char) => {
					const newChar = char === ' ' ? char : OBFUSCATED_CHARACTER;
					answerArrayObfuscated.push(newChar);
				});
				this.setState({
					answer: title,
					answerArray,
					answerArrayObfuscated,
					answerImage: image,
					clues: { year, genres },
				});
			});
			get(`get-top-cast?tconst=${id}`).then((response) => {
				let { data } = response;
				data = data.slice(0, 3);
				const queryParams = `?tconst=${id}&currentCountry=GB&purchaseCountry=GB&id=${
					data[0].split('/')[2]
				}&id=${data[2].split('/')[2]}&id=${data[2].split('/')[2]}`;
				get(`get-charname-list${queryParams}`).then((response) => {
					const cast = [];
					for (let key in response.data) cast.push(response.data[key].name.name);
					this.setState((prevState) => ({
						clues: { cast, year: prevState.clues.year, genres: prevState.clues.genres },
						isLoading: false,
					}));
				});
			});
		});
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
			this.setState({ gameLost: true, gameOver: true });
		}
	};

	addEventListeners = () => document.addEventListener('keyup', (e) => this.validateKeyPress(e));

	revealAnswer = () => this.setState({ answerArrayObfuscated: this.state.answerArray });

	validateGuess = (e) => {
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		if (this.solveInput.current.value.toLowerCase() === this.state.answer.toLowerCase()) {
			this.revealAnswer();
			this.setState({ gameWon: true, gameOver: true });
		}
	};

	revealClue = (e) => {
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		const currentVal = this.state.remainingClues;
		if (currentVal > 0) {
			const newVal = currentVal - 1;
			this.setState({ remainingClues: newVal });
		}
	};

	giveUp = () => {
		this.revealAnswer();
		this.setState({ gameLost: true, gameOver: true });
	};

	render = () => {
		const { props, state } = this;
		if (state.isLoading) return <Loading text="Preparing your game" />;
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
							<button onClick={this.revealClue} type="button">
								Give me a clue ({state.remainingClues} clues left)
							</button>
							{state.remainingClues < 3 && <p>Released in {state.clues.year}</p>}
							{state.remainingClues < 2 && <p>Genres {state.clues.genres.join(', ')}</p>}
							{state.remainingClues < 1 && <p>Starred {state.clues.cast.join(', ')}</p>}
							<form onSubmit={(e) => this.validateGuess(e)}>
								<VisuallyHidden>
									<label htmlFor="solve">Solve it!</label>
								</VisuallyHidden>
								<input ref={this.solveInput} type="text" id="solve" name="solve" />
								<input type="submit" value="Solve it!" />
							</form>
							<button onClick={this.giveUp}>I give up</button>
						</>
					)}
					{state.gameOver && (
						<>
							<p>
								You {`${state.gameLost ? 'lost' : 'won'}`}! <a href="/">Play again?</a>
							</p>
							<p>
								<a href={`https://www.imdb.com/title/${state.answerId}`}>
									View <strong>&quot;{this.state.answer}&quot;</strong> on IMDb
								</a>
							</p>
							<Image src={state.answerImage} />
						</>
					)}
				</props.theme.layout.Wrap>
			</>
		);
	};
}

export default Home;
