import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import MapsPlace from 'material-ui/svg-icons/maps/place';

import { get } from '../common/http';
import { citiesUrl, zomatoLiteRed } from '../common/constants';
import { getCurrentCity, setCity, removeCity } from "../common/city";

class CurrentLocation extends Component {
    state = {
        city: '',
        cities: [],
        editMode: false
    };

    dataSourceConfig = {
        text: 'name',
        value: 'id',
    };

    constructor(props) {
        super(props);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
    }

    componentDidMount() {
        this.getCurrentLocation();
    }

    getCurrentLocation = () => {
        const currentLocation = getCurrentCity();
        if (currentLocation) {
            this.setState({
                city: currentLocation.name
            });
        }
    }

    handleUpdateInput = async (value) => {
        this.setState({
            cities: [
            ]
        });
        const resp = await get(citiesUrl, { params: { name: value } })
        this.setState({
            cities: resp.location_suggestions
        });
    };

    handleNewRequest = (city) => {
        setCity(city);
        this.setState({
            city: city.name,
            editMode: false
        });
        if (this.props.handleCitySelect) {
            this.props.handleCitySelect(city);
        }
    };

    handleRequestDelete() {
        this.setState({
            editMode: true
        });
        removeCity();
        if (this.props.handleCityDelete) {
            this.props.handleCityDelete();
        }
    }

    render() {
        if (this.state.city !== '' && !this.state.editMode) {
            return <Chip
                onRequestDelete={this.handleRequestDelete}
                style={{ marginTop: 10, margin: 4, padding: 2 }}>
                <MapsPlace style={{verticalAlign:'middle'}} />
                <strong> <span style={{ color: zomatoLiteRed, verticalAlign: 'top' }}> {this.state.city}</span></strong>
            </Chip>;
        } else {
            return <AutoComplete
                hintText="Search Location"
                dataSource={this.state.cities}
                dataSourceConfig={this.dataSourceConfig}
                onNewRequest={this.handleNewRequest}
                onUpdateInput={this.handleUpdateInput}
                filter={AutoComplete.caseInsensitiveFilter}
                openOnFocus={true}
                fullWidth={this.props.fullWidth}
            />
        }
    }

}

export default CurrentLocation;