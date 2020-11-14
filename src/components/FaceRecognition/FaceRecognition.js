import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
	return(
		// if boxes array has content, return image and boundaries divs
		boxes.length > 0 ? (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
				{/* for each boxes entry, retun boundary div for face boxes */}
				{boxes.map((box, i) => (
					<div key={i} className='bounding-box' style={{top: box.topEdge, right: box.rightEdge, bottom: box.bottomEdge, left: box.leftEdge}}></div>
				))}
			</div>
		</div>
		) : (
		// return if boxes array empty
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
			</div>
		</div>
		)
	);
}

export default FaceRecognition;