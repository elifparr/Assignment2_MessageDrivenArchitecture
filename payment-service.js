const amqp = require('amqplib');
const rabbitUrl = 'amqp://localhost';
let channel;

async function connectRabbitMQ() {
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    await channel.assertQueue('payment_queue');
    await channel.assertQueue('notification_queue');
    await channel.assertQueue('compensation_queue');
    channel.consume('payment_queue', async (msg) => {
        const booking = JSON.parse(msg.content.toString());
        // Her ödeme talimatı başarılı olduğunu varsayalım ve bildirim kuyruğuna gönderelim
        await channel.sendToQueue('notification_queue', Buffer.from(JSON.stringify(booking)));
        channel.ack(msg);
    });
}

async function sendNotificationMessage(booking) {
    await channel.sendToQueue('notification_queue', Buffer.from(JSON.stringify(booking)));
    console.log(`Notification message sent for bookingId: ${booking.id}`);
}

connectRabbitMQ();
sendNotificationMessage();