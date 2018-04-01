import React, { Component } from "react";
import { GridList, GridTile } from "material-ui/GridList";
import Subheader from "material-ui/Subheader";
import { isMobile } from "react-device-detect";
import Dialog from "material-ui/Dialog";
import CircularProgress from "material-ui/CircularProgress";

import CurrentLocation from "./currentlocation";
import { get } from "../common/http";
import { restaurantsUrl } from "../common/constants";
import { getCurrentCity } from "../common/city";
import image from "../common/restaurant.jpg";
import RestaurantSearch from "./restaurantsearch";
// import Restaurant from "./restaurant";

class Restaurants extends Component {
  state = {
    restaurants: [],
    citySelected: false,
    sortOrder: null
  };

  styles = {
    gridList: {
      padding: 10
    },
    restaurants: { display: "flex", flexDirection: "row-reverse" },
    showRestaurant: false
  };

  constructor(props) {
    super(props);
    this.getRestaurants = this.getRestaurants.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.handleCityDelete = this.handleCityDelete.bind(this);
    this.handleRestaurantClick = this.handleRestaurantClick.bind(this);
    this.sortRestaurants = this.sortRestaurants.bind(this);
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = () => {
    const currentLocation = getCurrentCity();
    if (currentLocation) {
      this.setState({
        cityId: currentLocation.id
      });
      this.getRestaurants(currentLocation.id);

    }
  }

  getRestaurants = async (cityId, sortOrder) => {
    try {
      this.setState({
        citySelected: true,
        loadingRestaurants: true,
        restaurants: []
      });
      const sort = sortOrder ? { sortOrder } : {};
      const resp = await get(restaurantsUrl, { params: { cityId: cityId ? cityId : this.state.cityId, ...sort } });
      if (Array.isArray(resp.restaurants)) {
        this.setState({
          restaurants: resp.restaurants.map(item => item.restaurant),
          loadingRestaurants: false
        });
      }
    } catch (error) {
    }
  }

  handleCitySelect(city) {
    this.setState({
      cityId: city.id,
      sortOrder: null
    });
    this.getRestaurants(city.id);
  }

  handleCityDelete() {
    this.setState({
      restaurants: [],
      citySelected: false
    });
  }

  handleRestaurantClick(restaurant) {
    this.setState({
      showRestaurant: true,
      currentRestaurant: restaurant
    });
  }

  sortRestaurants() {
    const sortOrder = (!this.state.sortOrder || this.state.sortOrder === "asc") ?
      "desc" : "asc";
    this.getRestaurants(null, sortOrder);
    this.setState({
      sortOrder
    });
  }

  fetchSearchResults(activeSearchItem, searchType) {
    this.getRestaurants();
  }

  render() {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <CurrentLocation handleCityDelete={this.handleCityDelete} handleCitySelect={this.handleCitySelect} />
          {this.state.citySelected && <Subheader style={{ fontSize: 17 }}>Restaurants</Subheader>}
        </div>
        {this.state.citySelected && <div>
          <RestaurantSearch handleSearch={this.fetchSearchResults} cityId={this.state.cityId} />
          <div onClick={this.sortRestaurants}
            style={{
              color: "green", cursor: "pointer", display: "flex", flexDirection: "row-reverse",
              padding: 10, marginTop: 5
            }} >
            <i className="material-icons"> {(!this.state.sortOrder || this.state.sortOrder === "desc") ? "arrow_downward" : "arrow_upward"}</i>
            {this.state.sortOrder ? "rating" : "relevance"}
          </div>
        </div>}
        <div>
          {(
            () => {

              if (this.state.restaurants.length > 0) {
                return <GridList
                  style={this.styles.gridList}
                  padding={isMobile ? 6 : 10}
                  cols={isMobile ? 1 : 3}>
                  {this.state.restaurants.map((restaurant) => (
                    <a onClick={() => { this.handleRestaurantClick(restaurant) }} style={{ cursor: "pointer" }}>
                      <GridTile
                        key={restaurant.id}
                        title={restaurant.name}
                        subtitle={<span>
                          {restaurant.location.locality}
                          <br />
                          <b> {restaurant.cuisines}</b>
                        </span>}
                        actionIcon={
                          <span title={restaurant.user_rating.rating_text}><span style={{ verticalAlign: "super", color: "antiquewhite" }}> {restaurant.user_rating.aggregate_rating}</span>
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
                </GridList>
              } else if (this.state.loadingRestaurants) {
                return <div style={{ position: "absolute", left: "47%" }}> <CircularProgress size={40} thickness={5} /></div>;
              }
            })()}
        </div>
        {this.state.currentRestaurant &&
          <Dialog
            title={this.state.currentRestaurant.name}
            modal={false}
            open={this.state.showRestaurant}>
            {/* <Restaurant restaurant={this.state.currentRestaurant} /> */}
          </Dialog>}
      </div>
    );
  }

}

export default Restaurants;