// endpointy aplikacji get/post/patch/delete

const { saveFile, getAllPhotos, getSinglePhoto, deleteSinglePhoto, editPhoto, addTagToPhoto, addManyTagsToPhoto, showTagsOfPhoto } = require("./fileController")


const router = async (req, res) => {
    if (req.url == "/api/photos" && req.method == "POST") {
        saveFile(req, res)
    }
    else if (req.url == "/api/photos" && req.method == "GET") {
        getAllPhotos(req, res)
        //  pobierz dane z tablicy i odpowiedz do klienta

    } else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method == "GET") {
        getSinglePhoto(req, res)
    } else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method == "DELETE") {
        deleteSinglePhoto(req, res)
    } else if (req.url == "/api/photos" && req.method == "PATCH") {
        editPhoto(req, res)
    } else if (req.url == "/api/photos/tags" && req.method == "PATCH") {
        addTagToPhoto(req, res)
    } else if (req.url == "/api/photos/tags/mass" && req.method == "PATCH") {
        addManyTagsToPhoto(req, res)
    } else if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/) && req.method == "GET") {
        showTagsOfPhoto(req, res)
    }

}

module.exports = router