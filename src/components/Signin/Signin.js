import React from 'react';

class Signin extends React.Component {
	// initialize state
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: ''
		}
	}

	// set state to entered email
	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value})
	}

	// set password state to entered password
	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value})
	}

	// store user sign in data to backend
	onSubmitSignIn = () => {
		fetch('https://lit-mountain-50047.herokuapp.com/signin', {
			method: 'post',
			headers: {'Content-type': 'application/json'},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
			.then(response => response.json())
			.then(user => {
				// if user id exists, set load user and go to homepage
				if (user.id) {
					this.props.loadUser(user);
					this.props.onRouteChange('home');
				}
			})
	}

	render() {
		return(
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
			  <div className="measure">
			    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
			      <div className="mt3">
			        <label className="db fw6 lh-copy f5" htmlFor="email-address">Email</label>
			        <input 
			        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			        	type="email" 
			        	name="email-address"  
			        	id="email-address" 
			        	onChange={this.onEmailChange}
			        />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f5" htmlFor="password">Password</label>
			        <input 
			        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			        	type="password" 
			        	name="password"  
			        	id="password" 
			        	onChange={this.onPasswordChange}
			        />
			      </div>
			    </fieldset>
			    <div className="">
			      <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f4 dib" type="submit" value="Sign in" />
			    </div>
	  		  </div>
			</main>
		</article>
		);
	}
}

export default Signin;