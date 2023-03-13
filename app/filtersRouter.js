// router tylko do api filtrów
const { getDataOfSinglePhoto, useFilter } = require("./filtersController.js")

const router = async (req, res) => {
    if (req.url.match(/\/api\/filters\/metadata\/([0-9]+)/) && req.method == "GET") {
        getDataOfSinglePhoto(req, res)
    } else if (req.url == "/api/filters" && req.method == "PATCH") {
        useFilter(req, res)
    }
}

module.exports = router