//Speakeasy Documentation https://www.npmjs.com/package/speakeasy
//npm i speakeasy
const express = require('express')
const { generateSecret, User, verifyToken } = require('./auth')
//npm i qrcode
//QR Code Documentation https://www.npmjs.com/package/qrcode
const qrcode = require('qrcode')

const app = express()
//Create a new users array to store users.
var users = [
    new User('morgan.pritchard@fhnw.edu', 1),
]
//For this example we just send a Image to the browser with the QR Code that allows two factor on our phones to work.
app.get('/qrcode', (req, res)=> {
    // .toDataURL returns a base64 encoded string that the image tag supports to be visible in the browser. It takes two arguments: the text to encode and the callback function to handle the base64 encoded string. In this example, I am generating a new secret for User[0] on each request. .otpauth_url is the URL that gives Google Auth settings for the user. 
    qrcode.toDataURL(generateSecret(users[0]).otpauth_url, (err, url) => {
        if(err) {
            res.status(500).send(err)
            return
        }
        //Send just a Image tag with our URL that qrcode gives us.
        res.send(`
            <img src="${url}" />`)
    })
})

app.get('/verify/:email/:code', (req, res) => {
    //Email is for us to get the correct user in this example with arrays, if we only had one user we would not need this.
    const email = req.params.email
    //Code is what the user types in the browser. (984894)
    const token = req.params.code
    //We have to find the user with the correct email
    if(users.find(user => user.email === email)) {
        const user = users.find(user => user.email === email)
        //Verifies the user's token with a helper function
        if(verifyToken(user, token)) {
            res.send('Valid')
        } else {
            res.send('Invalid')
        }
        return
    }
    res.send('Unable to find email.')
})

app.listen(3000, () => {
    console.log(`Server is Listening on 3000`)
})