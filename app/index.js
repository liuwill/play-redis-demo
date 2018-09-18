import appServer from './server'

const app = appServer.createApp()

const PORT = process.env.NODE_PORT || 3000
app.listen(PORT)

console.log(`🎡 SERVER START: http://0.0.0.0:${PORT}`)
