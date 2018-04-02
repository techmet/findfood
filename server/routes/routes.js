import request from "request";

const zomatoApiUrl = "https://developers.zomato.com/api/v2.1/";

const zomatoAPIKeyHeader = {
    "user-key": "78a4b878b82ea0c1dd7b4805ea67feaa"
};

const routes = (router) => {
    router.get("/api/cities", (req, res) => {
        if (req.query && req.query.name) {
            const options = {
                method: "GET",
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

    router.get("/api/restaurants/search", (req, res) => {
        if (req.query) {
            const { entityId, entityType, sortOrder, query, count, cuisines, category } = req.query;
            const entity = entityId ? {
                entity_id: entityId,
                entity_type: entityType || "city"
            } : {};
            const sort = sortOrder ? {
                sort: "rating", order: sortOrder
            } : {};

            const searchQuery = query ? {
                q: query
            } : {};

            const options = {
                method: "GET",
                url: `${zomatoApiUrl}search`,
                qs: {
                    ...entity,
                    ...sort,
                    ...searchQuery,
                    count,
                    cuisines,
                    category
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

    router.get("/api/categories", (req, res) => {
        const options = {
            method: "GET",
            url: `${zomatoApiUrl}categories`,
            headers: zomatoAPIKeyHeader
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            res.send(JSON.parse(body));
            res.end();
        });

    });

    router.get("/api/cuisines", (req, res) => {
        const { cityId } = req.query;
        const entity = cityId ? {
            city_id: cityId
        } : {};
        const options = {
            method: "GET",
            url: `${zomatoApiUrl}cuisines`,
            headers: zomatoAPIKeyHeader,
            qs: {
                ...entity
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            res.send(JSON.parse(body));
            res.end();
        });

    });

    router.get("/api/locations", (req, res) => {
        const { query } = req.query;
        const options = {
            method: "GET",
            url: `${zomatoApiUrl}locations`,
            headers: zomatoAPIKeyHeader,
            qs: {
                query
            }
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            res.send(JSON.parse(body));
            res.end();
        });

    });

}

export default routes;