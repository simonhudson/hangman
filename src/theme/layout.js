'use strict';

import styled from 'styled-components';

const Wrap = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	width: 94%;

	${({ theme }) =>
		theme.media(
			'tablet-l',
			`
			width: 984px;
			`
		)};
`;

module.exports = { Wrap };
