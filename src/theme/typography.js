'use strict';

import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

const isValidHeading = (element) => element && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(element.toLowerCase());

const H1 = (props) => {
	const element = isValidHeading(props.element) ? props.element.toLowerCase() : 'h1';

	const StyledH1 = styled[element]`
		color: ${({ theme }) => theme.palette.primary.bodyText};
		font-family: 'Lora', sans-serif;
		font-weight: 400;
		font-size: ${rem(50)};
		margin-bottom: 1rem;
		text-align: center;
	`;

	return <StyledH1>{props.children}</StyledH1>;
};

export { H1 };
