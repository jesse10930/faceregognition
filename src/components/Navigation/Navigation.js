import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn, route }) => {
	// if isSignedIn state true, return signed in page
	if (isSignedIn) {
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
			</nav>
		); 
	} else {
		// if sign in or sign out pressed, go to register page
		if (route === 'signin' || route === 'signout') {
			return (
				<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
					<p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
				</nav>
			);
			// if isSignedIn is false and route not signin or signout, go to sign in page
		} else {
			return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
			</nav>
			);
		}
	}
}

export default Navigation;