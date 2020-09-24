// Firebase
const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Telegraf
const Telegraf = require('telegraf');
const bot = new Telegraf(functions.config().telegrambot.key);

// RxJs
const rxjs = require('rxjs');
const { timer } = rxjs;

bot.on('text', ctx => {
    const text = ctx.message.text.split(' ')
    db.collection('centro').where('password', '==', `${text[0]}`).get()
    // eslint-disable-next-line consistent-return
    .then((snapshot) => {
        // eslint-disable-next-line promise/always-return
        if (snapshot.empty) {
            return ctx.reply(`Usted no esta asociado, digite de nuevo`);
        }
        snapshot.forEach((res) => {
            ctx.replyWithChatAction('typing');
            timer(1500).subscribe(() => {
                ctx.replyWithHTML(`<b>${res.data().name}</b> recibimos su información y la estamos procesando, sigamos adelante y consigamos la victoria.`);
                db.collection('centro').doc(res.id).collection('poll').add({ hora: '9:00', total: text[1] })
            })
        })
    })
    .catch((err) => console.log(err));
});

bot.launch();
exports.bot = functions.https.onRequest((req, res) => bot.handleUpdate(req.body, res));
