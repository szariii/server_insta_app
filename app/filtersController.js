// modyfikacje zdjęć
const sharp = require("sharp");
const { Photo, photoArray, tagArray, tagJsonArray, userList } = require("./model")

getMetadata = (idPhoto) => {
    return new Promise(async (resolve, reject) => {
        try {
            let url
            //console.log(photoArray)
            for (let i = 0; i < photoArray.length; i++) {
                if (idPhoto == photoArray[i].id) {
                    url = photoArray[i].url
                }
            }

            console.log(url)

            if (url) {
                console.log("weszlo w if")
                let meta = await sharp(url)
                    .metadata()
                //console.log(meta)
                resolve(meta)
            }
            else {
                resolve("url_not_found")
            }

        } catch (err) {
            reject(err)
        }
    })
}

getDataOfSinglePhoto = async (req, res) => {
    try {
        // let tagTable = req.url.split("/")
        // let tagId = tagTable[3]

        let idTable = req.url.split("/")

        let idPhoto = idTable[4]

        let metadataOfPhoto = await getMetadata(idPhoto)
        console.log(metadataOfPhoto)

        res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        res.end(JSON.stringify(metadataOfPhoto))
    } catch (error) {
        console.log(error)
    }
}

useFilter = (req, res) => {
    let body = "";
    req.on("data", function (data) {
        console.log("data: " + data)
        body += data.toString();
    })

    //console.log(body)

    req.on("end", async function (data) {
        let filter = JSON.parse(body)
        console.log(filter)
        let photo = ""

        for (let i = 0; i < photoArray.length; i++) {
            if (filter.id == photoArray[i].id) {
                console.log(photoArray[i])

                let urlTable = photoArray[i].url.split("/")
                let fileNameTable = urlTable[3].split(".")
                let fileName = fileNameTable[0]
                switch (filter.operation) {
                    case "tint":
                        let urlNewphoto = urlTable[0] + "/" + urlTable[1] + "/" + urlTable[2] + "/" + fileName + "-tint.jpg"
                        await sharp(photoArray[i].url)
                            .tint({ r: 255, g: 0, b: 0 })
                            .toFile(urlNewphoto);
                        photoArray[i].lastChange = "tint"
                        let date = new Date();
                        let timestamp = date.getTime()
                        let obj = {
                            "status": "tint",
                            "timestamp": timestamp,
                            "url": urlNewphoto
                        }
                        photoArray[i].history.push(obj)
                        break

                    case "resize":
                        let urlNewphoto1 = urlTable[0] + "/" + urlTable[1] + "/" + urlTable[2] + "/" + fileName + "-resized.jpg"
                        await sharp(photoArray[i].url)
                            .resize({
                                width: filter.width,
                                height: filter.height
                            })
                            .toFile(urlNewphoto1);
                        photoArray[i].lastChange = "resized"
                        let date1 = new Date();
                        let timestamp1 = date1.getTime()
                        let obj1 = {
                            "status": "resized",
                            "timestamp": timestamp1,
                            "url": urlNewphoto1
                        }
                        photoArray[i].history.push(obj1)
                        break
                    case "crop":
                        let urlNewphoto2 = urlTable[0] + "/" + urlTable[1] + "/" + urlTable[2] + "/" + fileName + "-cropped.jpg"
                        await sharp(photoArray[i].url)
                            .extract({
                                width: filter.width,
                                height: filter.height,
                                left: filter.left,
                                top: filter.top
                            })
                            .toFile(urlNewphoto2);
                        photoArray[i].lastChange = "cropped"
                        let date2 = new Date();
                        let timestamp2 = date2.getTime()
                        let obj2 = {
                            "status": "cropped",
                            "timestamp": timestamp2,
                            "url": urlNewphoto2
                        }
                        photoArray[i].history.push(obj2)
                        break
                }

                photo = photoArray[i]
            }
        }

        res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        res.end(JSON.stringify(photo))
    })
}

module.exports = { getDataOfSinglePhoto, useFilter }