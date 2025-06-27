const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

let qrCodeData = null;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', async (qr) => {
    qrCodeData = await QRCode.toDataURL(qr); // ⬅️ تحويل QR إلى صورة
    console.log('✅ QR code ready. Go to http://localhost:3000');
});

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
});

client.on('message', async (message) => {
    if (message.body === '!ping') {
        await message.reply('pong');
    }

    const text = message.body.toLowerCase();
    if (text === 'mong-tv') {
        try {
            const apkPath = path.join(__dirname, 'files', 'Mong-tv.apk');
            const media = await MessageMedia.fromFilePath(apkPath);
            await message.reply('📦 جاري إرسال تطبيق Mong-tv...');
            await client.sendMessage(message.from, media);
        } catch (err) {
            console.error('❌ فشل في إرسال الملف:', err);
            await message.reply('❌ حدث خطأ أثناء إرسال الملف.');
        }
    }
});

client.initialize();

app.get('/', (req, res) => {
    if (!qrCodeData) {
        return res.send('<h2>⏳ يرجى الانتظار... يتم توليد QR Code</h2>');
    }

    res.send(`
        <html>
        <head><title>QR Code</title></head>
        <body style="text-align: center; font-family: sans-serif;">
            <h2>📱 اسحب الكود لتسجيل الدخول إلى WhatsApp</h2>
            <img src="${qrCodeData}" />
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`🌐 Server running on http://localhost:${port}`);
});
