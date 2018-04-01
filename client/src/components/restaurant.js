
import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import image from "../common/restaurant.jpg";

class Restaurant extends Component {
    render() {
        const { restaurant } = this.props;

        return (

            <Card>
                <CardText>
                    <img alt="" height="300" width="100%" src={restaurant.featured_image || image} />
                    <div><strong>Cuisines:</strong> {restaurant.cuisines}</div>
                    <div><strong>Location:</strong> {restaurant.location.address}</div>
                    <div><strong>Rating:</strong> {restaurant.user_rating.aggregate_rating}</div>
                    <div><strong>Votes:</strong> {restaurant.user_rating.votes}</div>
                </CardText>
            </Card>

        );
    }
}

export default Restaurant;