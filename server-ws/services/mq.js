const redis = require('redis')

require('dotenv').config()

const [host, port] = process.env.MQ_BROKER.split(':')

const redisClient = redis.createClient({
    socket: {
        host: host,
        port: port
    }
})

exports.getPubSubClients = async () => {
    await redisClient.connect()

    const pubClient = redisClient.duplicate()
    const subClient = redisClient.duplicate()

    return Promise.all([pubClient.connect(), subClient.connect()])
}