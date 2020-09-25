const Markup = require('telegraf/markup');
// RxJs
const rxjs = require('rxjs');
const { timer } = rxjs;


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
    },
    
    onMenu(ctx) {
        return ctx.reply(
            'Vea nuestras opciones: ',
            Markup.inlineKeyboard([
                [
                    Markup.callbackButton('Ver Requisitos', 'requisitos'),
                    Markup.callbackButton('Enviar Voucher', 'pagar')
                ],
                [Markup.callbackButton('Ayuda', 'denuncia')]
        ]).extra());
    },
    
    onMenuRequisitos(ctx) {
        return ctx.reply(
            'Clique en una de las opciones y vea los requisitos para realizar el tramite: ',
            Markup.inlineKeyboard([
                [
                    Markup.callbackButton('Actividades Económicas', 'actividades'),
                    Markup.callbackButton('Licencia de Licores', 'licores')
                ],
                [Markup.callbackButton('Regresar', 'menu')]
        ]).extra());
    },
    
    onChatAction(ctx, options,text='typing', time=1500) {
        timer(time).subscribe(() => {
            ctx.replyWithChatAction(text);
            options
        });
    },

    onSendPhoto(ctx, photo, caption, menu) {
        ctx.replyWithChatAction('upload_photo');
        timer(2000).subscribe(() => {
            ctx.replyWithPhoto(photo, extra= {
                caption: caption,
                reply_markup: Markup.inlineKeyboard([Markup.callbackButton('Regresar', menu)])
            });
        });
    },
    onStart(ctx) {
        ctx.replyWithHTML(`
            Hola <b>${ctx.chat.first_name}</b>, soy el asistente virtual de la dirección de Hacienda del municipio Francisco Linares Alcantára del estado Aragua.
        `);
        return this.onMenu(ctx);
    }
}