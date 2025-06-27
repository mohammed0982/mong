const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ✅ عرض QR صغير للطرفية
client.on('qr', (qr) => {
    console.clear(); // يمسح الشاشة قبل عرض QR باش تبان مزيان
    console.log('🔐 Scan the QR code below:');
    qrcode.generate(qr, { small: true }); // small = QR صغير
});

client.on('ready', () => {
    console.log('✅ Client is ready!');
});

client.on('message', async (message) => {
    if (message.body === '!ping') {
        await message.reply('pong');
    }

    const receivedText = message.body.toLowerCase();

    if (receivedText === 'mong-tv') {
        try {
            const apkPath = path.join(__dirname, 'files', 'Mong-tv.apk');
            const media = await MessageMedia.fromFilePath(apkPath);
            await message.reply('📦 جارٍ إرسال تطبيق Mong-tv إليك...');
            await client.sendMessage(message.from, media);
        } catch (error) {
            console.error('❌ Error sending file:', error);
            await message.reply('❌ حدث خطأ أثناء إرسال الملف.');
        }
    }
});

client.initialize();
