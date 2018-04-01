import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { Card, CardHeader, CardText } from "material-ui/Card";
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

class RestaurantSearch extends Component {


    state = {
        restaurants: [],
        searchType: "category"
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
                        <div style={isMobile ? {} : { width: "30%" }}>
                            <AutoComplete
                                hintText="Search Restaurant by Name"
                                dataSource={this.state.restaurants}
                                dataSourceConfig={this.dataSourceConfig}
                                onNewRequest={this.handleNewRequest}
                                onUpdateInput={this.handleUpdateInput}
                                filter={AutoComplete.caseInsensitiveFilter}
                                openOnFocus={true}
                                fullWidth={true}
                            />
                        </div>
                        {isMobile && <hr align="center" style={{
                            height: 2,
                            width: "50%",
                            border: "none",
                            backgroundColor: "#d2cfcf"
                        }} />}
                        <div style={isMobile ? {} : { width: "35%", marginTop: "-24px", borderLeft: "2px solid #d2cfcf", paddingLeft: "2%" }}>
                            <SelectField
                                floatingLabelText="Select search type"
                                value={this.state.searchType}
                                onChange={this.handleChange}
                                fullWidth={true}
                            >
                                <MenuItem value="category" primaryText="Category" />
                                <MenuItem value="cusinetype" primaryText="Cusine Type" />
                                <MenuItem value="locality" primaryText="Locality" />
                            </SelectField>
                        </div>
                        <div style={isMobile ? {} : { width: "30%" }}>
                            <AutoComplete
                                hintText={`Search Restaurant by ${this.state.searchType}`}
                                dataSource={this.state.restaurants}
                                dataSourceConfig={this.dataSourceConfig}
                                onNewRequest={this.handleNewRequest}
                                onUpdateInput={this.handleUpdateInput}
                                filter={AutoComplete.caseInsensitiveFilter}
                                openOnFocus={true}
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <RaisedButton fullWidth={isMobile} label="Search" primary={true} />
                </CardText>
            </Card>
        </div>);
    }
}

export default RestaurantSearch;