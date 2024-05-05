const express = require('express');
const amqp = require('amqplib');
const app = express();
app.use(express.json());
// Connect to RabbitMQ
const rabbitUrl = 'amqp://localhost'; 
let channel;
async function connectRabbitMQ() {
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    await channel.assertQueue('payment_queue');
}
// Booking endpoint to reserve a room
app.post('/book', async (req, res) => {
    const booking = req.body; 
    if (bookingReservedSuccessfully) {
      await publishToQueue('payment_queue', booking); 
      return res.status(200).json({ message: 'Booking initiated', booking }); 
    } else { 
      return res.status(500).json({ message: 'Booking failed' }); 
    }
});
// Start the server and connect to RabbitMQ
const PORT = 3000;
app.listen(PORT, async () => {
    console.log('Booking Service listening on port${PORT}' );
    await connectRabbitMQ();
});