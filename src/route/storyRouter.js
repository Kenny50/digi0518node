const { uuid } = require('uuidv4');
const { getBackgroundStoryByItineraryId } = require('../model/BackgroundStory')
const StoryPrompt = require('../promptTemplate/storyPrompt')
const { client, promptToCommand } = require('../service/bedrockClient')
const multer = require('multer')

const {
    StoryHistory,
    Itineraries,
    Attractions,
    AttractionInItinerary
} = require('../db/models.js')

function storyRouter(app) {
    app.get('/get-history-story-by-session', multer().single(), async (req, res) => {
        const { session } = req.query
        const sessionHistory = await StoryHistory.findAll({
            where: {
                session: session
            },
            order: [['step', 'DESC']] // Specify the order as an array of arrays
        })

        res.json({ sessionHistory })
    })

    app.get('/storyStream', multer().single(), async (req, res) => {
        let { session, itineraryId, step } = req.query
        itineraryId = parseInt(itineraryId)
        step = parseInt(step)
        const itinerary = await Itineraries.findByPk(itineraryId, {
            include: {
                model: Attractions,
                through: AttractionInItinerary,
                order: [['order', "ASC"]]
            }
        })
        // const itinerary = getItinerayById(itineraryId)
        const backgroundStory = getBackgroundStoryByItineraryId(itineraryId)

        let nextLocation
        if (itinerary.Attractions.length != step) {
            if (!itinerary.Attractions[step]) return res.json({ status: "next location not found" })
            nextLocation = itinerary.Attractions[step].name
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
        console.log(backgroundStory)
        let prompt
        if (step == 0) {
            prompt = new StoryPrompt().initStoryTemplate(backgroundStory.background, nextLocation)
            //init story prompt
        }
        if (step > 0 && step < itinerary.Attractions.length) {
            prompt = new StoryPrompt().connectStoryTemplate(backgroundStory.background, hasPrevious.story, nextLocation)
            //connectStoryTemplate
        }
        if (step == itinerary.Attractions.length) {
            //final story prompt
            prompt = new StoryPrompt().finalStoryTemplate(backgroundStory.background, hasPrevious.story, itinerary.Attractions.pop().name, backgroundStory.expectEnd)
        }
        try {
            const command = promptToCommand(prompt)
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
            // console.log(step)
            // console.log(itinerary.Attractions.length)
            // res.write(prompt);
        } catch (error) {
            console.error("处理API响应时发生错误：", error);
            res.write(`data: ${JSON.stringify({ error: "An error occurred while processing the request" })}\n\n`);
        }

        res.end();
    })
    app.post('/storyRecord', multer().single(), async (req, res) => {
        let { session, itineraryId, step, story, attractionId } = req.body
        itineraryId = parseInt(itineraryId)
        step = parseInt(step)
        attractionId = parseInt(attractionId)

        let attraction
        if (step != 0) {
            const hasPrevious = await StoryHistory.findOne({
                where: {
                    session: session,
                    itineraryId: itineraryId,
                    step: step - 1
                }
            })

            if (!hasPrevious) return res.status(404).json({ "status": "error" })
            attraction = Attractions.findByPk(attractionId)
        }

        await StoryHistory.create({
            session,
            itineraryId,
            step,
            story
        })
        // insert({
        //     session,
        //     itineraryId,
        //     step,
        //     story,
        //     attractionCover: attraction ? attraction.cover : undefined,
        //     attractionName: attraction ? attraction.name : undefined,
        //     attractionId: attraction ? attraction.id : undefined
        // })
        res.json({
            "status": "success",
        })
    })
    app.post('/checkinLocation', multer().single(), async (req, res) => {
        let { session, itineraryId, previousStep, locationId } = req.body
        itineraryId = parseInt(itineraryId)
        previousStep = parseInt(previousStep)
        locationId = parseInt(locationId)

        const hasPrevious = await StoryHistory.findOne({
            where: { session, itineraryId, step: previousStep }
        })
        //aware setp 1 - 1
        // const hasPrevious = getStoryHistory({ session, itineraryId, step: previousStep })
        if (!hasPrevious) return res.status(404).json({ "status": "error" })
        const itinerary = await Itineraries.findByPk(itineraryId, {
            include: {
                model: Attractions,
                through: AttractionInItinerary,
                order: [['order', "ASC"]]
            }
        })
        const arrivedLocationIndex = itinerary.Attractions.findIndex(obj => obj.id == locationId);
        const currentAttraction = itinerary.Attractions[arrivedLocationIndex];
        if (itinerary.Attractions.length == hasPrevious.step) {
            //final
            res.json({
                "isFinal": true
            })
        } else if (arrivedLocationIndex == hasPrevious.step) {
            //check is right location
            //return step +=1
            const isFinal = arrivedLocationIndex == itinerary.Attractions.length - 1
            res.json({
                session: session,
                itineraryId: itineraryId,
                previousStep: arrivedLocationIndex,
                currentStep: arrivedLocationIndex + 1,
                isFinal: isFinal,
                currentAttraction: currentAttraction.id,
                nextAttraction: isFinal ? null : itinerary.Attractions[arrivedLocationIndex + 1].id,
                attractionName: currentAttraction.name
            })
        } else {
            //error
            return res.status(400).json({ "status": "error" })
        }
    })
    app.post('/startItinerary', multer().single(), async (req, res) => {
        let { itineraryId } = req.body
        itineraryId = parseInt(itineraryId)
        // console.log(itineraryId)
        const itinerary = await Itineraries.findByPk(itineraryId, {
            include: {
                model: Attractions,
                through: AttractionInItinerary,
                order: [['order', "ASC"]]
            }
        })

        const session = uuid()

        res.json({
            session: session,
            step: 0,
            itineraryId: itinerary.id,
            currentAttraction: undefined,
            nextAttraction: itinerary.Attractions[0].id
        })
    })
}

module.exports = storyRouter 