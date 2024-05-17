const Form = require('../db/model/Form');
const multer = require('multer');
const sequelize = require('../db/initDb');
const { Op } = require('sequelize');
const { detectLanguageCode, translateToEn } = require('../service/reviewUtil')
function formRouter(app) {
    app.post('/form', multer().single(), async (req, res) => {
        const { itineraryId, trafficRate, itineraryRate, attractionRate, text } = req.body

        const review = await Form.create(req.body)
        const languageCode = await detectLanguageCode(review.text)
        const enText = await translateToEn(review, languageCode)
        review.en = enText
        review.save()

        res.json({ "statuc": "success" })
    })
    app.get('/form', async (req, res) => {
        const allForm = await Form.findAll()
        res.json(allForm)
    })

    app.get('/form/rate-average', async (req, res) => {
        const averageRates = await Form.findOne({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('trafficRate')), 'avgTrafficRate'],
                [sequelize.fn('AVG', sequelize.col('itineraryRate')), 'avgItineraryRate'],
                [sequelize.fn('AVG', sequelize.col('attractionRate')), 'avgAttractionRate']
            ]
        });

        res.json(averageRates);
    })

    app.get('/form/rate/traffic', async (req, res) => {
        const trafficRates = await Form.findAll({
            attributes: ['trafficRate', [sequelize.fn('COUNT', sequelize.col('trafficRate')), 'count']],
            group: ['trafficRate'],
            where: {
                trafficRate: {
                    [Op.not]: null // Exclude null values
                }
            }
        });

        res.json(trafficRates);
    })
}

module.exports = formRouter;