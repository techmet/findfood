import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { Card, CardHeader, CardText } from "material-ui/Card";
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import { get } from "../common/http";
import { restaurantsUrl, categoriesUrl, cuisinesUrl, locationsUrl } from "../common/constants";

class RestaurantSearch extends Component {
    state = {
        restaurants: [],
        restaurantsBySearchType: [],
        searchType: "category",
        categories: [],
        cuisines: [],
        activeSearchItem: null
    };

    constructor(props) {
        super(props);
        this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
        this.getRestaurantByName = this.getRestaurantByName.bind(this);
        this.getRestaurantBySearchType = this.getRestaurantBySearchType.bind(this);
        this.handleNewRequest = this.handleNewRequest.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }

    componentDidMount() {
        this.getCategories();
        this.getCusines();
    }

    handleSearchTypeChange(event, index, value) {
        this.setState({
            searchType: value
        });
    }

    getRestaurantByName = async (searchText) => {
        this.setState({
            restaurants: [
            ]
        });
        try {
            const { cityId } = this.props;
            const resp = await get(restaurantsUrl, { params: { cityId, query: searchText, count: 10 } });

            this.setState({
                restaurants: resp.restaurants.map(item => ({
                    text: item.restaurant.name,
                    value: (< MenuItem primaryText={`${item.restaurant.name},
                    ${item.restaurant.user_rating.aggregate_rating},
                    ${item.restaurant.location.locality}`} />)
                }))
            });
        }
        catch (error) {

        }
    }

    getRestaurantBySearchType = async (searchText) => {
        this.setState({
            restaurantsBySearchType: [
            ],
            activeSearchItem: null
        });
        try {
            const { searchType } = this.state;
            let results = [];
            searchText = searchText.toLowerCase();
            switch (searchType) {
                case "category":
                    results = this.state.categories.filter(item => item.text.toLowerCase().indexOf(searchText) > -1);
                    break;
                case "cusinetype":
                    results = this.state.cuisines.filter(item => item.text.toLowerCase().indexOf(searchText) > -1);
                    break;
                case "locality":
                    const res = await get(locationsUrl, { params: { query: searchText } });
                    results = res.location_suggestions.map(item => ({ value: item, text: item.title }));
                    break;
                default:
                    break;
            }

            this.setState({
                restaurantsBySearchType: results.slice(0, 9)
            });
        }
        catch (error) {

        }
    }

    getCategories = async () => {
        try {
            const resp = await get(categoriesUrl);

            this.setState({
                categories: resp.categories.map(item => ({ value: item.categories.id, text: item.categories.name }))
            });
        } catch (error) {

        }

    }

    getCusines = async () => {
        try {
            const resp = await get(cuisinesUrl, { params: { cityId: this.props.cityId } });

            this.setState({
                cuisines: resp.cuisines.map(item => ({ value: item.cuisine.cuisine_id, text: item.cuisine.cuisine_name }))
            });
        } catch (error) {

        }

    }

    handleNewRequest(item) {
        this.setState({
            activeSearchItem: item
        });
    }

    handleSearchClick() {
        if (this.props.handleSearch) {
            this.props.handleSearch(this.state.activeSearchItem, this.state.searchType);
        }
    }

    render() {
        return (<div style=
            {{
                margin: isMobile ? "10px 2% 0 2%" : "10px 0.5% 0 0.5%",
                width: isMobile ? "96%" : "99%",
                display: "inline-block",
                borderRadius: 5
            }} >
            <Card style={{ backgroundColor: "#eee" }}>
                <CardHeader
                    subtitle="Search"
                    actAsExpander={true}
                    showExpandableButton={true}
                    style={{ color: "#7f7d7d" }}
                />
                <CardText expandable={true}>
                    <div style={{ display: isMobile ? "block" : "flex", justifyContent: "space-between" }}>
                        <div style={isMobile ? {} : { width: "40%" }}>
                            <AutoComplete
                                hintText="Search Restaurant by name"
                                dataSource={this.state.restaurants}
                                onUpdateInput={this.getRestaurantByName}
                                fullWidth={true}
                                filter={AutoComplete.noFilter}
                            />
                        </div>
                        {isMobile && <hr align="center" style={{
                            height: 2,
                            width: "50%",
                            border: "none",
                            backgroundColor: "#d2cfcf"
                        }} />}
                        <div style={isMobile ? {} : { width: "25%", marginTop: "-24px", borderLeft: "2px solid #d2cfcf", paddingLeft: "2%" }}>
                            <SelectField
                                floatingLabelText="Select search type"
                                value={this.state.searchType}
                                onChange={this.handleSearchTypeChange}
                                fullWidth={true}
                            >
                                <MenuItem value="category" primaryText="Category" />
                                <MenuItem value="cusinetype" primaryText="Cusine Type" />
                                <MenuItem value="locality" primaryText="Locality" />
                            </SelectField>
                        </div>
                        <div style={isMobile ? {} : { width: "30%" }}>
                            <AutoComplete
                                hintText={`Search for ${this.state.searchType}`}
                                dataSource={this.state.restaurantsBySearchType}
                                onNewRequest={this.handleNewRequest}
                                onUpdateInput={this.getRestaurantBySearchType}
                                fullWidth={true}
                                filter={AutoComplete.noFilter}
                            />
                        </div>
                    </div>
                    <div style={isMobile ? {} : { marginLeft: "70%", marginRight: "2%" }}>
                        <RaisedButton onClick={this.handleSearchClick} disabled={!this.state.activeSearchItem} fullWidth={true} label="Search" primary={true} />
                    </div>
                </CardText>
            </Card>
        </div>);
    }
}

export default RestaurantSearch;