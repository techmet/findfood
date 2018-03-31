const request = require("request");

const zomatoApiUrl = 'https://developers.zomato.com/api/v2.1/';

const zomatoAPIKeyHeader = {
    'user-key': '3114118dcc5cd8f18ae49df284f7305b'
};

const routes = (router) => {
    router.get('/api/cities', (req, res) => {
        if (req.query && req.query.name) {
            const options = {
                method: 'GET',
                url: `${zomatoApiUrl}cities`,
                qs: {
                    q: req.query.name
                },
                headers: zomatoAPIKeyHeader
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                res.send(JSON.parse(body));
                res.end();
            });

        } else {
            res.send({
                "location_suggestions": []
            });
        }
    });

    router.get('/api/restaurants/search', (req, res) => {
        if (req.query) {
            const { cityId, sortOrder } = req.query;
            const entity = cityId ? {
                entity_id: cityId,
                entity_type: 'city'
            } : {};
            const sort = sortOrder ? {
                sort: "rating", order: sortOrder
            } : {};

            const options = {
                method: 'GET',
                url: `${zomatoApiUrl}search`,
                qs: {
                    ...entity,
                    ...sort
                },
                headers: zomatoAPIKeyHeader
            };

            console.log(options);
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                const resp = JSON.parse(body);
                res.send(resp);
                res.end();
            });

        } else {
            res.send({
                "restaurants": []
            });
        }
    });
}

export default routes;