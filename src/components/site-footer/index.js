'use strict';

import React from 'react';
import { Wrapper, Text } from './index.styles';
import { layout } from '~/theme';

const SiteFooter = (props) => {
	const currentYear = new Date().getFullYear();

	return (
		<layout.Wrap>
			<Wrapper data-test="footer">
				<Text data-test="footer__copyright">
					Copyright {currentYear} <a href="http://www.simonhudson.net">Simon Hudson</a>
				</Text>
			</Wrapper>
		</layout.Wrap>
	);
};

export default SiteFooter;
