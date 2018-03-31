import React, { Component } from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import { isMobile } from 'react-device-detect';

import CurrentLocation from "./currentlocation";
import { get } from '../common/http';
import { restaurantsUrl } from '../common/constants';
import { getCurrentCity } from "../common/city";
import image from '../common/restaurant.jpg';

class Restaurants extends Component {
  state = {
    restaurants: [],
    citySelected: false
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
    try {
      this.setState({
        citySelected: true
      });
      const resp = await get(restaurantsUrl, { params: { cityId } });
      if (Array.isArray(resp.restaurants)) {
        this.setState({
          restaurants: resp.restaurants.map(item => item.restaurant)
        });
      }
    } catch (error) {
      this.setState({
        restaurants: []
      });
    }
  }

  handleCitySelect(city) {
    this.getRestaurants(city.id);
  }

  handleCityDelete() {
    this.setState({
      restaurants: [],
      citySelected: false
    });
  }

  render() {
    return (
      <div>
        <div style={this.styles.restaurants}>
          <CurrentLocation handleCityDelete={this.handleCityDelete} handleCitySelect={this.handleCitySelect} />
        </div>
        <div>
          {(
            () => {
              if (this.state.restaurants.length > 0) {
                return <GridList
                  style={this.styles.gridList}
                  padding={isMobile ? 6 : 10}
                  cols={isMobile ? 1 : 3}
                >
                  <Subheader style={{ paddingLeft: 0, fontSize: 17 }}>Restaurants</Subheader>
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
                        style={{ borderRadius: 4, boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)" }}
                      >
                        <img alt="" src={restaurant.featured_image || image} />
                      </GridTile>
                    </a>
                  ))}
                </GridList>;
              } else if (this.citySelected) {
                return <div className="no-results">No data found!</div>;
              }
            })()}
        </div>
      </div>
    );
  }

}

export default Restaurants;