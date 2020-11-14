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
  // load background image
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

// declare initial state
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  boxes: [],
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
  // initialize state
  constructor() {
    super();
    this.state = initialState;
  }

  // set user state when user signs in
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // find location of faces in image
  calculateFaceLocation = (data) => {
    let clarifaiFacesArr = [];
    let i = 0;

    // loop through all face locations returned from clarifai
    while (i < data.outputs[0].data.regions.length) {
      // declare face boundaries, set width + heigh based on image
      const clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);

      // declare object with boundaries for face box
      let clarifaiFaceOutline = {
        leftEdge: clarifaiFace.left_col * width,
        topEdge: clarifaiFace.top_row * height,
        rightEdge: width - (clarifaiFace.right_col * width),
        bottomEdge: height - (clarifaiFace.bottom_row * height)
      }

      // save face box boundaries to an array
      clarifaiFacesArr.push(clarifaiFaceOutline)
      i += 1;
    }
    return clarifaiFacesArr;
  }


  // set boxes state to bounary array
  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  // set input state upon input change
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // fetch data, declare face locations
  onButtonSubmit = () => {
    // set imageURL state to image url input value
    this.setState({imageUrl: this.state.input});
    // get data from backend based on imageURL state
      fetch('https://lit-mountain-50047.herokuapp.com/imageUrl', {
          method: 'post',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
              input: this.state.input
          })
      })
      .then(response => response.json())
      .then(response => {
        // if face data found, store image data to backend
        if (response) {
          fetch('https://lit-mountain-50047.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              // set state for count based on number of images detected for user
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        // get face locations, set values in state
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  // set states based on nav buttons pressed
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
    // declare state
    const { isSignedIn, imageUrl, route, boxes } = this.state;
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
        {/* based on route state, return home, signin, or register page */}
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
                boxes={boxes}
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