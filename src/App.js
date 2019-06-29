import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 300,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component{
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftEdge: clarifaiFace.left_col * width,
      topEdge: clarifaiFace.top_row * height,
      rightEdge: width - (clarifaiFace.right_col * width),
      bottomEdge: height - (clarifaiFace.bottom_row * height)
    };
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://agile-spire-65240.herokuapp.com/imageUrl', {
          method: 'post',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
              input: this.state.input
          })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://agile-spire-65240.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    } else if (route === 'signin') {
      this.setState({isSignedIn: false})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, box, imageUrl, route } = this.state;
    return (
      <div className="App">
        <Particles 
          className='particles' 
          params={particlesOptions}
        />
        <div className='nav'>
          <Logo />
          <Navigation 
            route={route} 
            isSignedIn={isSignedIn} 
            onRouteChange={this.onRouteChange}
          />
        </div>
        { route === 'home'
          ? <div>
              <Rank 
                name={this.state.user.name} 
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition 
                imageUrl={imageUrl} 
                box={box}
              />
            </div>
          : (
            (route === 'signin' || route === 'signout')
            ? <Signin 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange}
              />
            : <Register 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange}
              />
          )
        }
      </div>
    );
  }
}

export default App;