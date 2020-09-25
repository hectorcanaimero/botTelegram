const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

const rxjs = require('rxjs');
const { timer } = rxjs;

const db = admin.firestore();
const handle = require('./psuv-handle');
// const bot = new Telegraf(functions.config().telegrambot.key);
const bot = new Telegraf('1319035820:AAEHCW88w5aj3KSb0qdkSiT-_YlXQidgzkA');

bot.on('message', (ctx) => {
    let texto = ctx.message.text; 
    texto = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if(texto === '/start') handle.onStart(ctx);
    if (texto === 'menu' || texto === '/menu' || texto === ' menu' || texto === 'menu ') handle.onMenu(ctx);
    if(texto.split(' ')[0] === 'centro') {
        let centro = texto.split(' ')[1]
        if (centro) {
            db.collection('centro').where('codigo', '==', `${centro}`).get().then((index) => {
                // eslint-disable-next-line promise/always-return
                if (index.empty){
                    handle.onText(ctx, `O Codigo de Centro esta errado`)
                }
                index.forEach((res) => {
                    handle.onText(ctx, `Ahora vamos a validar su identidad para el centro de votación <b>${res.data().centro}</b>.\n Digite psuv seguido de su fecha de nacimiento y su telefono:\n<b>ejemplo: psuv ${centro} 01/01/1960 04165555555</b>`)
                })
            }).catch((err) => console.log(err));
        }
    }
})


/** 
 * Actions
 */
bot.action('responsable', (ctx) => {
    handle.onText(ctx, `${ctx.chat.first_name}, necesitamos registrar tu identidad, te vamos hacer una serie de pregunta para validar tu identidad.\nDigite la palabra <b>centro</b> seguidamente con el codigo del centro:\n<b>Ejempo: centro 123456</b>`)
})


/** 
 * Command
 * 
 */
bot.command('start', (ctx) => handle.onStart(ctx))

bot.launch()

exports.psuv = functions.https.onRequest((req, res) => bot.handleUpdate(req.body, res));



