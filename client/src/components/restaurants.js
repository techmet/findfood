import React, { Component } from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';

import CurrentLocation from "./currentlocation";
import { get } from '../common/http';
import { restaurantsUrl } from '../common/constants';
import { getCurrentCity } from "../common/city";
import image from '../common/restaurant.jpg';

class Restaurants extends Component {
  state = {
    restaurants: []
  };

  styles = {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    gridList: {
      padding: 10
    },
    restaurants: { position: 'absolute', right: '5px' }
  };

  constructor(props) {
    super(props);
    this.getRestaurants = this.getRestaurants.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.handleCityDelete = this.handleCityDelete.bind(this);
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = () => {
    const currentLocation = getCurrentCity();
    if (currentLocation) {
      this.getRestaurants(currentLocation.id);
    }
  }

  getRestaurants = async (cityId) => {
    const resp = await get(restaurantsUrl, { params: { cityId } });
    if (Array.isArray(resp.restaurants)) {
      this.setState({
        restaurants: resp.restaurants.map(item => item.restaurant)
      });
    }
  }

  handleCitySelect(city) {
    this.getRestaurants(city.id);
  }

  handleCityDelete() {
    this.setState({
      restaurants: []
    });
  }

  render() {
    return (
      <div>
        <div style={this.styles.restaurants}>
          <CurrentLocation handleCityDelete={this.handleCityDelete} handleCitySelect={this.handleCitySelect} />
        </div>
        <div>
          <GridList
            style={this.styles.gridList}
          >
            <Subheader>Restaurants</Subheader>
            {this.state.restaurants.map((restaurant) => (
              <a target="_blank" href={restaurant.url}>
                <GridTile
                  key={restaurant.id}
                  title={restaurant.name}
                  subtitle={<span> <b>{restaurant.cuisines}</b></span>}
                  actionIcon={
                    <span title={restaurant.user_rating.rating_text}><span style={{ verticalAlign: 'super', color: 'antiquewhite' }}> {restaurant.user_rating.aggregate_rating}</span>
                      <i className="material-icons"
                        style={{ color: `#${restaurant.user_rating.rating_color}` }}>
                        grade</i>
                    </span>
                  }
                  style={{ borderRadius: 4 }}
                >
                  <img alt="" src={restaurant.featured_image || image} />
                </GridTile>
              </a>
            ))}
          </GridList>
        </div>
      </div>
    );
  }

}

export default Restaurants;