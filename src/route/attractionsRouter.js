
const {
    StoryHistory,
    Itineraries,
    Attractions,
    AttractionInItinerary
} = require('../db/models.js')

function attractionsRouter(app) {
    app.get('/attractions', async (req, res) => {

        const attractions = await Attractions.findAll()
        const itineraries = await Itineraries.findAll()

        res.json({
            attractions: attractions,
            itineraries: itineraries
        })
    })

    app.get('/attraction/:id', async (req, res) => {
        let { id } = req.params
        id = parseInt(id)
        const attractions = await Attractions.findByPk(id)

        res.json(attractions)
    })
}

module.exports = attractionsRouter;