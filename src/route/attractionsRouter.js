const {
    StoryHistory,
    Itineraries,
    Attractions,
    AttractionInItinerary
} = require('../db/models.js')
const Sequelize = require('sequelize');
const axios = require('axios');
const { client, promptAttractionToCommand } = require('../service/bedrockClient')
const topTenAttractionIntroPrompt = require('../promptTemplate/topTenAttractionsIntroPrompt')

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

    app.get('/attractions/keyword', async (req, res) => {
        const { query } = req.query
        console.log(query)
        const attractions = await Attractions.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { name: { [Sequelize.Op.like]: `%${query}%` } },
                    { description: { [Sequelize.Op.like]: `%${query}%` } }
                ]
            }
        })

        res.json(attractions)
    })

    app.get('/attractions/ai-powered', async (req, res) => {
        const { query } = req.query

        const vectorRes = await axios.get(`http://127.0.0.1:8000/vector?query=${query}`)

        const vectorIds = vectorRes.data.result.map(innerArr => {
            return innerArr[0].metadata.id
        })
        console.log(vectorIds)
        const attractions = await Attractions.findAll({
            where: {
                id: {
                    [Sequelize.Op.in]: vectorIds
                }
            }
        })

        res.json(attractions)
    })

    app.get('/attractions/ai-powered/intro', async (req, res) => {
        const { query } = req.query

        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        const vectorRes = await axios.get(`http://127.0.0.1:8000/vector?query=${query}`)

        const vectorIds = vectorRes.data.result.map(innerArr => {
            return innerArr[0].metadata.id
        })
        console.log(vectorIds)
        const attractions = await Attractions.findAll({
            where: {
                id: {
                    [Sequelize.Op.in]: vectorIds.slice(0, 10)
                }
            }
        })
        //todo prompt
        const prompt = topTenAttractionIntroPrompt(attractions)
        try {
            const command = promptAttractionToCommand(prompt)
            const apiResponse = await client.send(command);
            // 解码并处理响应流
            for await (const item of apiResponse.body) {
                const chunk = JSON.parse(new TextDecoder().decode(item.chunk.bytes));
                const chunk_type = chunk.type;

                if (chunk_type === "content_block_delta") {
                    const text = chunk.delta.text;
                    res.write(text);
                }
            }
            // console.log(prompt)
            // res.write(prompt)
        } catch (error) {
            console.error("处理API响应时发生错误：", error);
            res.write(`data: ${JSON.stringify({ error: "An error occurred while processing the request" })}\n\n`);
        }

        res.end();
    })
}

module.exports = attractionsRouter;