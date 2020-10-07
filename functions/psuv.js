/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

const moment = require('moment');
const now = moment(new Date().toLocaleString('es-VE', {timeZone: "America/Caracas"}));

const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

const rxjs = require('rxjs');
const { timer } = rxjs;

const db = admin.firestore();
const handle = require('./psuv-handle');
// const bot = new Telegraf(functions.config().telegrambot.key);
const bot = new Telegraf('1319035820:AAEHCW88w5aj3KSb0qdkSiT-_YlXQidgzkA');

bot.on('message', (ctx) => {
    let receive = ctx.message.text; 
    let split = receive.split(' ');
    let texto = split[0];
    texto = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if(texto === '/start' || texto === 'start' || texto === 'hola' || texto === 'camarada') handle.onStart(ctx);
    if (texto === 'menu' || texto === '/menu' || texto === ' menu' || texto === 'menu ') handle.onMenu(ctx);
    if(texto === 'data' || texto === 'cne') onCNE(ctx, split);
    if(texto === 'psuv') onPSUV(ctx, split);
})

onCNE = (ctx, texto) => {
    const passw = parseInt(texto[1]);
    const centro = parseInt(texto[2]);
    const value = parseInt(texto[3]);
    ctx.replyWithChatAction('typing');
    timer(2000).subscribe(() => {
        if (passw === 4523 || passw === 6655) {
            db.collection('centro').where('codigo', '==', centro).get().then((index) => {
                // eslint-disable-next-line promise/always-return
                if (index.empty) handle.onError(ctx, `Ops!!! 😱 La Contraseña es incorrecta o no estas registrado, escribe menu y seleciona la opción de sala situacional`);
                index.forEach((res) =>{
                    db.collection('centro').doc(res.id).collection('poll').orderBy('data', 'desc').limit(1).get().then((index2) => {
                        index2.forEach((doc) => {
                            let psuv = 0;
                            if (doc.data().psuv) psuv = doc.data().psuv; 
                            db.collection('centro').doc(res.id).collection('poll').add({ data: now, psuv: psuv, cne: value } );   
                            db.collection('centro').doc(res.id).set({
                                centro: res.data().centro,
                                codigo: res.data().codigo,
                                electores: res.data().electores,
                                location: res.data().location, 
                                total: { data: now, cne: value, psuv: psuv}
                            } );                
                            handle.onText(ctx, `😉 Se registro el valor correctamente. 😛`);
                        })
                    })
                    .catch((err) => console.log(err));
                })
            }).catch((err) => console.log(err));
        } else {
            handle.onError(ctx, `Ops!!! 😱 La Contraseña es incorrecta o no estas registrado, escribe menu y seleciona la opción de sala situacional`);
        }
    })
}

onPSUV = (ctx, texto) => {
    const passw = parseInt(texto[1]);
    const value = parseInt(texto[2]);
    ctx.replyWithChatAction('typing');
    timer(2000).subscribe(() => {
        db.collection('centro').where('password', '==', passw).get().then((index) => {
            // eslint-disable-next-line promise/always-return
            if (index.empty){
                handle.onError(ctx, `Ops!!! 😱 La Contraseña es incorrecta o no estas registrado, escribe menu y seleciona la opción de sala situacional`);
            }
            index.forEach((res) =>{
                db.collection('psuv').add({ data: now, psuv: value } );  
                db.collection('centro').doc(res.id).collection('poll').orderBy('data', 'desc').limit(1).get().then((index2) => {
                    index2.forEach((doc) => {
                        let cne = 0;
                        if (doc.data().cne) cne = doc.data().cne; 
                        db.collection('centro').doc(res.id).collection('poll').add({ data: now, psuv: value, cne: cne } );
                        db.collection('centro').doc(res.id).set({
                            centro: res.data().centro,
                            codigo: res.data().codigo,
                            electores: res.data().electores,
                            location: res.data().location, 
                            total: { data: now, cne: cne, psuv: value}
                        } );              
                        handle.onText(ctx, `😉 Se registro el valor correctamente. 😛`);
                    })
                })
                .catch((err) => console.log(err));
            })
        }).catch((err) => console.log(err));
    })
}


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



