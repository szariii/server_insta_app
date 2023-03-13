// modyfikacje jsona opisującego stan tagów

const { Photo, photoArray, tagArray, tagJsonArray, userList } = require("./model")

createJsonTags = () => {
    for (let i = 0; i < tagArray.length; i++) {
        let tag = {}
        tag.id = i
        tag.name = tagArray[i]
        tag.popularity = (Math.round(Math.random() * 1000))
        tagJsonArray.push(tag)
    }
}

addTag = (req, res) => {
    //console.log(req)
    let body = "";
    req.on("data", function (data) {
        console.log("data: " + data)
        body += data.toString();
    })

    //console.log(body)

    req.on("end", function (data) {
        let addedTag = JSON.parse(body)
        tagArray.push(addedTag.name)

        let id = 0;
        for (let i = 0; i < tagJsonArray.length; i++) {
            if (id < tagJsonArray[i].id) {
                id = tagJsonArray[i].id
            }
        }
        newTag = {}
        newTag.id = (id + 1)
        newTag.name = addedTag.name
        newTag.popularity = addedTag.popularity
        tagJsonArray.push(newTag)

        res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        res.end(JSON.stringify(addedTag))
    })
}

showArraysTag = (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(tagArray))
}

showJsonArraysTag = (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(tagJsonArray))
}

showSingleTag = (req, res) => {
    let tag = ""
    let tagTable = req.url.split("/")
    let tagId = tagTable[3]
    for (let i = 0; i < tagJsonArray.length; i++) {
        if (tagId == tagJsonArray[i].id) {
            tag = tagJsonArray[i]
        }
    }

    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(tag))
}

module.exports = { addTag, createJsonTags, showArraysTag, showJsonArraysTag, showSingleTag }