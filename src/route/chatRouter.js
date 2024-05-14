const { uuid } = require('uuidv4');

function chatRouter(app) {
    app.post('/session', async (req, res) => {
        const session = uuid()
        res.json({ session: session })
    })
}

module.exports = chatRouter