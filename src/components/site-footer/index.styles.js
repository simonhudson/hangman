'use strict';

import styled from 'styled-components';
import { rem } from 'polished';

const Wrapper = styled.footer`
	border-top: 1px solid #ddd;
	margin-top: ${rem(40)};
	padding: ${rem(20)} 0;
	text-align: right;
	width: 100%;
`;

const Text = styled.p`
	font-size: ${rem(14)};
`;

export { Wrapper, Text };
