
const fs = require('fs');
const { Photo, photoArray, Tag, tagArray, tagJsonArray, userList } = require("./model")
const path = require("path")

const uploadsRouter = async (req, res) => {
    console.log(req)
    let uploadTable = req.url.split("/")
    let url = path.join(__dirname, "/../upload/" + uploadTable[2] + "/" + uploadTable[3])
    // for (let i = 0; i < photoArray.length; i++) {
    //     if (url = photoArray[i].url) {
    //         photo = photoArray[i]
    //     }
    // }

    console.log(url)

    fs.readFile(url, function (error, data) {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.write(data);
        res.end();
    })
    // res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    // res.end(photo.url)
}

module.exports = uploadsRouter