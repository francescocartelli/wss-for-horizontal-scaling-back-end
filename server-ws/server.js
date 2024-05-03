const WebSocket = require('ws')

const { createConnectionManager } = require.main.require('./utils/connection-manager')
const { getPubSubClients } = require.main.require('./services/mq')
const { getIdentity } = require.main.require('./services/identity')

require('dotenv').config()

const boot = async () => {
    const wss = new WebSocket.Server({ port: process.env.WSS_PORT })

    const [pubClient, subClient] = await getPubSubClients()

    const addConnection = createConnectionManager()

    wss.on('connection', async (ws, req) => {
        const userId = getIdentity(req)

        const { to, remove, isInit } = addConnection(userId, ws)

        if (isInit) await subClient.subscribe(userId, message => {
            to(conn => conn.send(message))
        })

        ws.on('message', message => {
            const { recipient, content } = JSON.parse(message)
            const delivery = { recipient: recipient, sender: userId, content: content }

            // console.log(delivery)

            pubClient.publish(recipient, JSON.stringify(delivery))
        })

        ws.on('close', () => {
            remove(() => subClient.unsubscribe(userId))
        })
    })

    console.log(`WebSocket server running on port ${process.env.WSS_PORT}`)
}

boot()
