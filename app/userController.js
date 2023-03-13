const nodemailer = require("nodemailer")
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Photo, photoArray, tagArray, tagJsonArray, userList } = require("./model")


let id = 0

const config = {
    service: 'Yahoo',
    auth: {
        user: process.env.YAGOO_LOGIN,
        pass: process.env.YAHOO_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
}

const createToken = async (mail) => {
    let token = await jwt.sign(
        {
            email: mail,
            anyData: "123"
        },
        "verysecretkey", // powinno być w .env
        {
            expiresIn: "1h" // "1m", "1d", "24h"
        }
    );
    console.log({ token: token });
    return token
}


sendRegisterMail = async (mail) => {
    //console.log(body)
    let token = await createToken(mail)
    let link = "http://localhost:3000/api/user/confirm/" + token
    console.log(mail)
    const transporter = nodemailer.createTransport(config)
    transporter.sendMail({
        from: "konradszarek@yahoo.com",
        to: mail,
        subject: "Confirm your account",
        text: "Kliknij w ponizszy link:\n" + link + "\n w celu potwierdzenia konta \n Uwaga: link jest ważny przez godzinę",
        html: "<p>Kliknij w ponizszy link: </br> <a href = '" + link + "'>" + link + "+</a> </br> w celu potwierdzenia konta </br> Uwaga: link jest ważny przez godzinę</p>"
    });


}

userRegister = (req, res) => {
    let body = "";
    req.on("data", function (data) {
        body += data.toString();
    })

    //console.log(body)

    req.on("end", async function (data) {
        let mailinfo = JSON.parse(body)
        console.log(mailinfo)
        if (mailinfo.name != undefined && mailinfo.lastName != undefined && mailinfo.email != undefined && mailinfo.password != undefined) {
            let userExist = false
            for (let i = 0; i < userList.length; i++) {
                if (mailinfo.email == userList[i].email) {
                    userExist = true
                }
            }

            if (userExist == false) {



                const pass = mailinfo.password
                const encryptPass = async (password) => {
                    let encryptedPassword = await bcrypt.hash(password, 10);
                    //console.log({ encryptedPassword: encryptedPassword });
                    return encryptedPassword
                }
                let password = await encryptPass(pass)
                console.log(password)

                id = id + 1

                let user = {
                    "id": id,
                    "name": mailinfo.name,
                    "lastName": mailinfo.lastName,
                    "email": mailinfo.email,
                    "confirmed": false,
                    "password": password
                }

                console.log(user)

                userList.push(user)
                sendRegisterMail(mailinfo.email)
                //res.end("finito")
                res.writeHead(201, { "Content-Type": "application/json" })
                res.end("Utworzono uzytkownika")
            } else {
                res.writeHead(409, { "Content-Type": "application/json" });
                res.end("Użytkownik istnieje")
            }
        } else {
            res.writeHead(400, { "Content-Type": "application/json" })
            res.end("niepełne dane")
        }

    })

}

const verifyToken = async (token) => {
    let tokenLive = ""
    try {
        let decoded = await jwt.verify(token, "verysecretkey")
        console.log({ decoded: decoded });
        tokenLive = decoded
    }
    catch (ex) {
        console.log({ message: ex.message });
        tokenLive = ex.message
    }

    return tokenLive
}

clickOnToken = async (req, res) => {
    console.log("weszlo w click ontoken")
    let tableUrl = req.url.split("/")

    let token = tableUrl[4]
    console.log(token)
    let tokenExist = await verifyToken(token)
    if (tokenExist.decoded == "jwt expired") {
        res.writeHead(401, { "Content-Type": "application/json" })
        res.end("Token wygasł")
    } else {
        for (let i = 0; i < userList.length; i++) {
            console.log(userList[i])
            if (tokenExist.email == userList[i].email) {
                userList[i].confirmed = true
            }
        }

        res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
        res.end("Konto zostało potwierdzone")
    }
}

getAllUsers = (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
    res.end(JSON.stringify(userList))
}

const decryptPass = async (userpass, encrypted) => {

    let decrypted = await bcrypt.compare(userpass, encrypted)
    return decrypted
}



login = (req, res) => {
    let body = ""
    req.on("data", function (data) {
        console.log("data: " + data)
        body += data.toString();
    })

    req.on("end", async function (data) {

        let userData = JSON.parse(body)
        console.log(userData)
        let user = ""
        for (let i = 0; i < userList.length; i++) {
            if (userData.email == userList[i].email) {
                user = userList[i]
            }
        }

        let samePasswords = await decryptPass(userData.password, user.password)
        console.log(samePasswords);

        if (samePasswords == true) {
            let token = createToken(user.email)
            res.writeHead(404, { "Content-Type": "application/json", "authorization": "Bearer " + token });
            res.end("Zalogowano")
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end("User not found")
        }

    })
}


module.exports = { userRegister, clickOnToken, getAllUsers, login }