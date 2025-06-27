const { Client, LocalAuth, MessageMedia } = 
require('whatsapp-web.js'); const qrcode = 
require('qrcode-terminal'); const path = require('path'); const 
client = new Client({
    authStrategy: new LocalAuth(), puppeteer: { headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});
client.on('qr', qr => {
  qrcode.generate(qr, {
    small: true,      
    scale: 4,         
    whitespaceMargin: 2 
  });
  
  console.log('🔍 يرجى مسح رمز QR أعلاه لربط واتساب');
});

client.on('message', async message => { if (message.body === 
    '!ping') {
        await message.reply('pong');
    }
    
    const receivedText = message.body.toLowerCase(); if 
    (receivedText === 'mong-tv') {
        try { const apkPath = path.join(__dirname, 'files', 
            'Mong-tv.apk'); const media = await 
            MessageMedia.fromFilePath(apkPath); await 
            message.reply(' جارٍ إرسال تطبيق Mong-tv إليك...'); 
            await client.sendMessage(message.from, media);
        } catch (error) {
            console.error('Error sending file:', error); await 
            message.reply('❌ حدث خطأ أثنا إرسال الل');
        }
    }
});
client.initialize();
