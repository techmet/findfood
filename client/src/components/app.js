import React, { Component } from 'react';
import './app.css';
import Dialog from 'material-ui/Dialog';
import CurrentLocation from "./currentlocation";
import Restaurants from "./restaurants";
import { getCurrentCity } from "../common/city";

class App extends Component {
  state = {
    open: true
  };

  hasCurrentLocation = () => {
    const currentCity = getCurrentCity();
    return currentCity;
  }

  handleCitySelect = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">zomato lite</h1>
        </header>
        {(() => {
          if (this.hasCurrentLocation()) {
            return <Restaurants />
          } else {
            return <Dialog
              title="Current Location"
              modal={true}
              open={this.state.open}>
              <CurrentLocation fullWidth={true} handleCitySelect={this.handleCitySelect} />
            </Dialog>
          }
        })()}
      </div>
    );
  }
}

export default App;
