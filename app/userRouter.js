const { userRegister, clickOnToken, getAllUsers, login } = require("./userController.js")

const userRouter = async (req, res) => {
    console.log(req.method)
    console.log(req.url)
    console.log("weszlo w router")
    if (req.url == "/api/user/register" && req.method == "POST") {
        console.log("weszlo w else if userReguister")
        userRegister(req, res)
    } else if (req.url.match(/\/api\/user\/confirm\/([0-9a-zA-Z]+)/) && req.method == "GET") {
        console.log("weszlo w else if")
        clickOnToken(req, res)
    } else if (req.url == "/api/user" && req.method == "GET") {
        getAllUsers(req, res)
    } else if (req.url == "/api/user/login" && req.method == "POST") {
        login(req, res)
    }
}

module.exports = userRouter