const { Message } = require("firebase-functions/lib/providers/pubsub");

module.exports = {
    /**
     * onError 
     * Revisa si la cadena de informacion es correcta
     * @param {*} text
     * @returns
     */

    onError(text) {
        let message = '';
        let arr = text.split(' ');
        if (typeof (arr) !== object || typeof (arr[0]) !== number || typeof (arr[1] !== number)) {
            message = 'Opps! Que estas haciendo?, Digite correctamente, ejemplo: contraseña total';
        }
        return message;
    }
}