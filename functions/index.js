// Firebase
const functions = require('firebase-functions');

// Telegraf
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');
// const bot = new Telegraf(functions.config().telegrambot.key);
const bot = new Telegraf('1381534856:AAESqFpCrEV0GlIo0ZKYvGqDTrCvkfOHbZo');
const telegram = new Telegram('1381534856:AAESqFpCrEV0GlIo0ZKYvGqDTrCvkfOHbZo');
// RxJs
const rxjs = require('rxjs');
const { timer } = rxjs;

const handler = require('./handler');

// Conversation Handler
bot.on('text', (ctx) => {
    let texto = ctx.message.text; 
    texto = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if(texto === '/start') handler.onStart(ctx);
    if (texto === 'menu' || texto === '/menu' || texto === ' menu' || texto === 'menu ') handler.onMenu(ctx);
    if (texto.split(' ')[0] === 'voucher') {
        ctx.replyWithChatAction('typing');
        timer(1500).subscribe(() => ctx.replyWithHTML(
            `Tu comercio es <b>${texto.split(' ')[1]} </b>, ahora envianos el voucher en formato de imagen (jpg, png) <b>** Importante soló acepto imagenes</b>:`))
    }
    if (texto.split(' ')[0] === 'ayuda') {
        ctx.replyWithChatAction('typing');
        timer(1500).subscribe(() => ctx.replyWithHTML(
            `Tu información fue enviada, nuestro equipo se pondra en contacto contigo. <b>${ ctx.chat.first_name} ${ ctx.chat.last_name}</b> gracias por confiar en nosotros.`))

    }
})

/** 
 * Menu Principal
 * Acciones dle Menu Princi
*/
bot.action('requisitos', (ctx) => handler.onMenuRequisitos(ctx))
bot.action('pagar', (ctx) => {
    ctx.replyWithChatAction('typing');
    timer(1500).subscribe(() => {
        ctx.replyWithHTML(`Hola <b>${ ctx.chat.first_name }</b>, gracias por escoger esta forma de pagamento. Ahora necesitamos algunas información para validar tu voucher:`);
        ctx.replyWithHTML('Digite la palabra <b>voucher</b> seguidamente su codigo de patente, ejemplo "voucher 123": ')
    })
})
bot.action('denuncia', (ctx) => {
    ctx.replyWithChatAction('typing');
    timer(1500).subscribe(() => {
        ctx.replyWithHTML(`Hola <b>${ ctx.chat.first_name }</b>, este canal es para escuchar planteamiento, dudas y denuncias.:`);
        ctx.replyWithHTML('Digite la palabra <b>ayuda</b> seguidamente de su planteamiento "ayuda xxx xxx xxx": ')
    })
})
/** 
 * SubMenus
 * Acciones del Submenu Requisitos
*/
bot.action('actividades', (ctx) => {
    handler.onSendPhoto(ctx,
    'https://firebasestorage.googleapis.com/v0/b/psuv-poll.appspot.com/o/454dc53f-9867-4de3-996a-211fc64cf8f5.jpeg?alt=media&token=94290a73-678d-40c1-8d0c-3afe9b03433c',
    'Aqui estan todos los requisitos necesarios para renovar la Licencia de Actividades Económicas. 😉🥳🥳🎉🎉',
    'menuRequisitos'
    );
});

bot.action('licores', (ctx) => {
    handler.onSendPhoto(ctx,
    'https://firebasestorage.googleapis.com/v0/b/psuv-poll.appspot.com/o/454dc53f-9867-4de3-996a-211fc64cf8f5.jpeg?alt=media&token=94290a73-678d-40c1-8d0c-3afe9b03433c',
    'Vea todos los requisitos la Licencia de Licores. 😉🥳🥳🎉',
    'menuRequisitos'
    );
});

bot.action('menu', (ctx) => handler.onMenu(ctx));
bot.action('menuRequisitos', (ctx) => handler.onMenuRequisitos(ctx));

/** 
 * Commands
 * */ 
bot.command('start', (ctx) => handler.onMenu(ctx));
bot.command('menu',  (ctx) => handler.onStart(ctx));

// Lauch Bot
bot.launch();

exports.hacienda = functions.https.onRequest((req, res) => bot.handleUpdate(req.body, res));
exports.psuv = require('./psuv');