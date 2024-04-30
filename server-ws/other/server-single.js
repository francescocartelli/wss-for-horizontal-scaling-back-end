const WebSocket = require('ws')

const { getPubSubClients } = require('../services/mq')
const { getIdentity } = require('../services/identity')

const boot = async () => {
    const wss = new WebSocket.Server({ port: 8000 })

    const [pubClient, subClient] = await getPubSubClients()

    wss.on('connection', async (ws, req) => {
        const userId = getIdentity(req)

        subClient.subscribe(userId, message => {
            ws.send(message)
        })

        ws.on('message', message => {
            const { recipient, content } = JSON.parse(message)
            const delivery = { recipient: recipient, sender: userId, content: content }

            console.log(delivery)

            pubClient.publish(recipient, JSON.stringify(delivery))
        })

        ws.on('close', () => {
            subClient.unsubscribe(userId)
        })
    })

    console.log(`WebSocket server running on port ${process.env.WSS_PORT}`)
}

boot()
