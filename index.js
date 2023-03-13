const imageRouter = require("./app/imageRouter")
const tagsRouter = require("./app/tagsRouter")
const filtersRouter = require("./app/filtersRouter")
const { addTag, createJsonTags } = require("./app/tagsController")
const uploadsRouter = require("./app/uploads")
const userRouter = require("./app/userRouter")
require('dotenv').config();

const http = require("http");
const PORT = 3000;
var fs = require('fs');

createJsonTags()


// ykzdpdkuetvqmjqy

http
    .createServer(async (req, res) => {
        //image

        if (req.url.search("/api/photos") != -1) {
            await imageRouter(req, res)
        }

        //tags

        else if (req.url.search("/api/tags") != -1) {
            await tagsRouter(req, res)
        }

        else if (req.url.search("/api/filters") != -1) {
            await filtersRouter(req, res)
        } else if (req.url.search("/uploads") != -1 && req.method == "GET") {
            uploadsRouter(req, res)
        } else if (req.url.search("/api/user") != -1) {
            userRouter(req, res)
        }

    })
    .listen(process.env.APP_PORT, () => console.log(`listen on ${process.env.APP_PORT}`))