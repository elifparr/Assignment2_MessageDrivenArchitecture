const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const rabbitUrl = 'amqp://localhost';
let channel;
async function connectRabbitMQ() {
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    await channel.assertQueue('notification_queue');
    channel.consume('notification_queue', async (msg) => {
        const booking = JSON.parse(msg.content.toString());
        // Insert logic to send email notification to the user
        console.log(`Sending booking confirmation for bookingId: ${booking.id}`);
        // Setup nodemailer transport here
        // Send email...
        channel.ack(msg);
    });
}

async function sendNotificationMessage(booking) {
    // Insert logic to send email notification to the user
    console.log(`Sending booking confirmation for bookingId: ${booking.id}`);
    // Setup nodemailer transport here
    // Send email...
}

connectRabbitMQ();
sendNotificationMessage();
