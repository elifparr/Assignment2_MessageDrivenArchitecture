const amqp = require('amqplib');

const rabbitUrl = 'amqp://localhost';
let channel;
async function connectRabbitMQ() {
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    await channel.assertQueue('compensation_queue');
    channel.consume('compensation_queue', async (msg) => {
        const booking = JSON.parse(msg.content.toString());
        // Insert logic to cancel the booking
        console.log('Compensating transaction: cancelling bookingId: ${booking.id} ');
        // Update booking status in database to 'CANCELLED' or similar...
        channel.ack(msg);
    });
}
connectRabbitMQ();