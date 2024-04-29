const createConnectionManager = require('../utils/connection-manager')
const colors = require('/utils/Colors')

const createWs = () => {
    return {
        send: (message) => {
            console.log(`${colors.FgBlue}to${colors.Reset}: (${message})`)
        },
        close: () => {
            // console.log("closed:", name)
        }
    }
}

const sendMessage = (message) => ws => ws.send(message)

const add = createConnectionManager()

const [toM1, removeM1] = add("mario", createWs("mario 1"))
const [toL1, removeL1] = add("luigi", createWs("luigi 1"))
const [toM2, removeM2] = add("mario", createWs("mario 2"))
const [toM3, removeM3] = add("mario", createWs("mario 3"))

toM1(sendMessage("hi huys"))

removeM1()

toM2(sendMessage("bye"))

removeM2()

toM3(sendMessage("is there anybody"))

const [sendL2, removeL2] = add("luigi", createWs("luigi 2"))

removeL1()

sendL2(sendMessage("hi"))
removeL2()

removeM3()

