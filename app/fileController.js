// modyfikacje samych plików (zapis/usunięcie/inne)

const { Photo, photoArray, Tag, tagArray, tagJsonArray, userList } = require("./model")

const formidable = require("formidable")

const fs = require("fs")
const path = require("path");



//form.multiples = true;

const saveFile = (req, res) => {
    const form = formidable({});
    form.uploadDir = "./upload/"

    form.parse(req, function (err, fields, files) {
        if (!fs.existsSync("./upload/" + fields.album)) {
            fs.mkdir("./upload/" + fields.album, (err) => {
                if (err) throw err
                //console.log("nie ma");
            })
        }

        let tablePathFile = files.file.path.split("\\")

        let filepath3 = "./upload/" + tablePathFile[tablePathFile.length - 1]
        let filepath4 = "./upload/" + fields.album + "/" + tablePathFile[tablePathFile.length - 1] + ".jpg"
        console.log(filepath3)
        fs.rename(filepath3, filepath4,
            (err) => {
                if (err) throw err
                let date = new Date();
                let timestamp = date.getTime()

                let photo = {
                    "id": timestamp,
                    "album": fields.album,
                    "originalName": files.file.name,
                    "url": filepath4,
                    "lastChange": "orginal",
                    "history": [{
                        "status": "original",
                        "timestamp": timestamp
                    }],
                    "tags": []
                }


                // let photo = new Photo(timestamp, fields.album, files.file.name, filepath4, "orginal", [
                //     {
                //         "status": "original",
                //         "timestamp": timestamp
                //     }
                // ])
                photoArray.push(photo)
                res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
                res.end(JSON.stringify(photo))
            })
    });
    //res.end()
}

const getAllPhotos = (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(photoArray))
}

const getSinglePhoto = (req, res) => {

    //console.log(req)
    let idTable = req.url.split("/")
    let idPhoto = idTable[3]

    let photo = ""
    for (let i = 0; i < photoArray.length; i++) {
        if (idPhoto == photoArray[i].id) {
            photo = photoArray[i]
        }
    }

    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(photo))
}

const deleteSinglePhoto = (req, res) => {
    let idTable = req.url.split("/")
    let idPhoto = idTable[3]

    let index = 0

    for (let i = 0; i < photoArray.length; i++) {
        if (idPhoto == photoArray[i].id) {
            index = i
            //photo = photoArray[i]
        }
    }

    let photo = photoArray.splice(index, 1)
    console.log(photo)

    fs.unlink(photo[0].url, (err) => {
        if (err) throw err
        //console.log("czas 1: " + new Date().getMilliseconds());
    })

    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(photo))
}

const editPhoto = (req, res) => {
    //console.log(req)

    let body = "";
    req.on("data", function (data) {
        console.log("data: " + data)
        body += data.toString();
    })

    //console.log(body)

    req.on("end", function (data) {
        let editHistory = JSON.parse(body)
        console.log(editHistory)
        let photo = ""

        for (let i = 0; i < photoArray.length; i++) {
            if (editHistory.id == photoArray[i].id) {

                let date = new Date();
                let timestamp = date.getTime()

                let obj = {
                    "status": editHistory.status,
                    "timestamp": timestamp
                }

                photoArray[i].history.push(obj)
                photo = photoArray[i]
                //photo = photoArray[i]
            }
        }

        res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        res.end(JSON.stringify(photo))
    })


    /*
    for (let i = 0; i < photoArray.length; i++) {
        if (idPhoto == photoArray[i].id) {
            index = i
            //photo = photoArray[i]
        }
    }

    let photo = photoArray.splice(index, 1)

    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(photo))
    */
}

addTagToPhoto = (req, res) => {
    let body = "";
    req.on("data", function (data) {
        //console.log("data: " + data)
        body += data.toString();
    })

    //console.log(body)

    req.on("end", function (data) {
        let addedTag = JSON.parse(body)
        //tagArray.push(addedTag.name)

        let photo = ""

        for (let i = 0; i < photoArray.length; i++) {

            if (addedTag.id == photoArray[i].id) {
                console.log("Weszlo do if")
                let obj = {
                    "name": addedTag.name,
                    "popularity": addedTag.popularity
                }
                photoArray[i].tags.push(obj)
                photo = photoArray[i]
            }
        }



        res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        res.end(JSON.stringify(photo))
    })
}

addManyTagsToPhoto = (req, res) => {
    let body = "";
    req.on("data", function (data) {
        //console.log("data: " + data)
        body += data.toString();
    })

    req.on("end", function (data) {
        console.log(body)
        let addedTag = JSON.parse(body)
        //tagArray.push(addedTag.name)

        let photo = ""

        for (let i = 0; i < photoArray.length; i++) {

            if (addedTag.id == photoArray[i].id) {
                console.log("Weszlo do if")
                for (let j = 0; j < addedTag.table.length; j++) {
                    // let obj = {
                    //     "name": addedTag.table[j].name,
                    //     "popularity": addedTag.table[j].popularity
                    // }
                    photoArray[i].tags.push(addedTag.table[j])
                }
                photo = photoArray[i]
            }
        }
        res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        res.end(JSON.stringify(photo))

    })
}

showTagsOfPhoto = (req, res) => {
    let tags = ""
    let photoTable = req.url.split("/")
    let photoId = tagTable[4]
    for (let i = 0; i < photoArray.length; i++) {
        if (photoId == photoArray[i].id) {
            tags = photoArray[i].tags
        }
    }

    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(tags))
}

module.exports = { saveFile, getAllPhotos, getSinglePhoto, deleteSinglePhoto, editPhoto, addTagToPhoto, addManyTagsToPhoto, showTagsOfPhoto }