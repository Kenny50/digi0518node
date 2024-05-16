const { where } = require("sequelize");
const { Summaries } = require('../db/models.js')

function summaryRouter(app) {
    app.get('/summary', async (req, res) => {
        const { query } = req.query
        console.log(query)
        const summary = await Summaries.findOne({
            where: {
                label: query
            }
        })

        res.json(summary)
    })
}

module.exports = summaryRouter;