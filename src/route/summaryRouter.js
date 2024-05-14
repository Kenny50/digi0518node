const { where } = require("sequelize");
const { Summaries } = require('../db/models.js')

function summaryRouter(app) {
    app.get('/summary', async (req, res) => {
        const { label } = req.query
        const summary = await Summaries.findOne({
            where: {
                label: label
            }
        })

        res.json(summary)
    })
}

module.exports = summaryRouter;