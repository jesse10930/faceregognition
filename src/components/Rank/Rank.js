import React from 'react';

const Rank = ({name, entries}) => {
	// display user's rank, based on number of times detected has ben pressed
	return (
		<div>
			<div className='f3'>
				{`${name}, your current rank is...`}
			</div>
			<div className='f1'>
				{entries}
			</div>
		</div>
	);
}

export default Rank;