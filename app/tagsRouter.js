const { addTag, createJsonTags, showArraysTag, showJsonArraysTag, showSingleTag } = require("./tagsController")

const tagsRouter = async (req, res) => {
    if (req.url == "/api/tags" && req.method == "POST") {
        addTag(req, res)
    } else if (req.url == "/api/tags/raw" && req.method == "GET") {
        showArraysTag(req, res)
    } else if (req.url == "/api/tags" && req.method == "GET") {
        showJsonArraysTag(req, res)
    } else if (req.url.match(/\/api\/tags\/([0-9]+)/) && req.method == "GET") {
        showSingleTag(req, res)
    }
}

module.exports = tagsRouter