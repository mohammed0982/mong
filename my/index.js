const { Client, LocalAuth, MessageMedia } = 
require('whatsapp-web.js'); 
const QRCode = require('qrcode');
const path = require('path'); const 
client = new Client({
    authStrategy: new LocalAuth(), puppeteer: { headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});


client.on('qr', async (qr) => {
  // إنشاء QR كصورة Base64
  const qrImage = await QRCode.toDataURL(qr, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  // حفظ QR كملف (اختياري)
  await QRCode.toFile('./qr.png', qr, { width: 300 });
  
  console.log('📌 | تم إنشاء QR، راجع ملف qr.png أو زر /qr');
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
