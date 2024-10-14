var speakEasy = require('speakeasy');

//We create a User Object to store the email, id and the secret key. 
class User {
    constructor(email, id) {
        this.email = email;
        this.id = id;
    }
}
/**
 * @description Generates a new secret using SpeakEasy for the user. 
 * @param {User} user 
 * @returns {{secret: string, otpauth_url: string}}
 */
function generateSecret(user) {
    /*We create a new secret using SpeakEasy. {
        // This name is the title in the Google Authenicator application 
        name: 'Two Factor Authentication Demo ' + user.email,
        // The issuer is the name of the application that is authenticating the user.
        issuer: 'Fort Hays Tech | Northwest',
        // By default, SHA1 is used. I added this here to show that you can change the hash levels if you want. (sha1, sha256, sha512)
        algorithm: 'sha1',
        // The length of the secret.
        length: 20,
    }

    */
    var secret = speakEasy.generateSecret({
        name: 'Two Factor Authentication Demo ' + user.email,
        issuer: 'Fort Hays Tech | Northwest',
        algorithm: 'sha1',
        length: 20,
    })
    //We get our otpauth:// URL to send back to our original call
    var otpauth_url = secret.otpauth_url;
    //Set our user's secret
    user.secret = secret.base32
    //Return our secret and otpauth_url
    return {secret: secret.base32, otpauth_url: otpauth_url} 
}

/**
 * 
 * @param {User} user 
 * @param {string} token This is what the user types in the browser
 * @returns {boolean}
 */
function verifyToken(user, token) {
    /*Verify the user's token
    {
    // Our user's secret that was generated from before
        secret: user.secret,
    // Our encoding type, by default it is base32    
        encoding: 'base32',
    // Our token that the user types in the browser
        token: token
    }
    */
    return speakEasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token: token
    })
}
module.exports = {User, generateSecret, verifyToken}