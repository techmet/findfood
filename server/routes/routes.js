const request = require("request");

const zomatoApiUrl = 'https://developers.zomato.com/api/v2.1/';

const zomatoAPIKeyHeader = {
    'user-key': '3114118dcc5cd8f18ae49df284f7305b'
};

const routes = (router) => {
    router.get('/api/cities', (req, res) => {
        if (req.query && req.query.name) {
            var options = {
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
        if (req.query && req.query.cityId) {
            var options = {
                method: 'GET',
                url: `${zomatoApiUrl}search`,
                qs: {
                    entity_id: req.query.cityId,
                    entity_type: 'city'
                },
                headers: zomatoAPIKeyHeader
            };

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