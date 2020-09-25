const Markup = require('telegraf/markup');
const rxjs = require('rxjs');
const { timer } = rxjs;

module.exports = {
    onStart(ctx) {
        ctx.replyWithChatAction('typing');
        timer(1500).subscribe(() => {
            ctx.replyWithHTML(`
                Hola <b>${ctx.chat.first_name}</b>, soy un asistente virtual del PSUV en Linares Alcantára para llevar el proceso de las elecciones parlamentarias.
            `);
            this.onMenu(ctx);
        })
    },
    onMenu(ctx) {
        ctx.replyWithChatAction('typing');
        timer(1500).subscribe(() => {
            ctx.reply(
                'Vea nuestras opciones: ',
                Markup.inlineKeyboard([
                    [
                        Markup.callbackButton('Registrar Responsable', 'responsable'),
                        Markup.callbackButton('Cambiar Contraseña', 'password')
                    ],
                    [Markup.callbackButton('Ver Reportes', 'reports')]
            ]).extra());
        })
    },
    onText(ctx, text) {
        ctx.replyWithChatAction('typing');
        timer(1000).subscribe(() => ctx.replyWithHTML(text));
    }
}