'use strict';

const COMMON_OPTIONS = {
	headers: {
		'x-rapidapi-host': 'imdb8.p.rapidapi.com',
		'x-rapidapi-key': process.env.API_KEY,
	},
	dataType: 'json',
	mode: 'cors',
};

const makeRequest = (endpoint, method) => {
	let responseObj = {
		error: null,
		data: null,
	};
	if (!endpoint || !method) return null;
	const options = { ...COMMON_OPTIONS, method };
	return new Promise((resolve, reject) => {
		fetch(`${process.env.API_URL}/${endpoint}`, options)
			.then((response) => response.json())
			.then((data) => {
				responseObj.data = data;
				resolve(responseObj);
			})
			.catch((error) => {
				responseObj.error = error;
				reject(responseObj);
			});
	});
};

export function get(endpoint) {
	return makeRequest(endpoint, 'GET');
}
