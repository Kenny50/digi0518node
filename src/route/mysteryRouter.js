const { uuid } = require('uuidv4');
const { client, promptMysteryToCommand } = require('../service/bedrockClient')
const multer = require('multer')

const {
    StoryHistory,
    Itineraries,
    Attractions,
    AttractionInItinerary
} = require('../db/models.js');
const MysteryPrompt = require('../promptTemplate/MysteryPrompt.js');

function mysteryRouter(app) {
    app.get('/mysteryStream', multer().single(), async (req, res) => {
        let { session, itineraryId, step, lang } = req.query
        itineraryId = parseInt(itineraryId)
        step = parseInt(step)
        en = lang == "en"
        const itinerary = await Itineraries.findByPk(itineraryId, {
            include: {
                model: Attractions,
                through: AttractionInItinerary,
                order: [['order', "ASC"]]
            }
        })

        let nextLocation
        if (itinerary.Attractions.length != step) {
            if (!itinerary.Attractions[step]) return res.json({ status: "next location not found" })
            nextLocation = itinerary.Attractions[step]
        }

        let hasPrevious
        if (step > 0) {
            hasPrevious = await StoryHistory.findOne({
                where: { session, itineraryId, step: step - 1 }
            })//check has previous step
            if (!hasPrevious) return res.status(500).json({ "status": "error" })
        }

        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        let task
        if (en) {
            task = nextLocation.enTask
        } else {
            task = nextLocation.task
        }
        let hint
        if (en) {
            hint = nextLocation.enHint
        } else {
            hint = nextLocation.hint
        }
        console.log(nextLocation)
        console.log(task)
        const prompt = new MysteryPrompt().mysteryTemplate(nextLocation.name, task, hint, en)

        try {
            const command = promptMysteryToCommand(prompt, en)
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

        } catch (error) {
            console.error("处理API响应时发生错误：", error);
            res.write(`data: ${JSON.stringify({ error: "An error occurred while processing the request" })}\n\n`);
        }

        res.end();
    })
}

module.exports = mysteryRouter;