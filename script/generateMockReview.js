const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const { Form } = require('../src/db/models');
const { where } = require("sequelize");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generationConfig = {
    maxOutputTokens: 1500,
    temperature: 0.9,
    topP: 0.1,
    topK: 16
};
const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig, requestOptions: { timeout: 30000 } });
async function getAllEmptyReview() {
    const emptyReviews = await Form.findAll({ where: { text: null } })
    return emptyReviews;
}

function extractRateFromReview(review) {
    return {
        trafficRate: review.trafficRate,
        itineraryRate: review.itineraryRate,
        attractionRate: review.attractionRate
    }
}

async function mockReview(rate) {
    // For text-only input, use the gemini-pro model

    const prompt = "Write a review of travel experience went to Qishan, Kaohsiung, Taiwan, your experience feeling as following rate"
        + "1 is most unsatisfing and 5 is most satisfying"
        + JSON.stringify(rate)
        + "\n The review must follow all rule below"
        + "1. Review should be 1000 vocabularies to 1500 vocabularies long"
        + "2. Review must not specific rating or section in the review, for exmaple `traffic earned a 4 out of 5 rating` ,`attractions: 3/5`, ...etc"
        + "3. Allow to mix different topic in same section"
        + "4. Pure text without any format, for example `**text**`"
        + "5. Try to be more emotional"
        + "6. It is possible that you travel with friends, family or travel alone, just choose one situation ramdonly"
        + "7. DO NOT container any sensitive words"

    const result = await model.generateContentStream(prompt);

    console.log("made response");
    let text = '';
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        // console.log(chunkText);
        text += chunkText;
    }
    return text
}

// (async () => {
//     const emptyReviews = await getAllEmptyReview();
//     for (const form of emptyReviews) {
//         const generatedText = await mockReview();
//         form.text = generatedText;
//         await form.save();
//     }
// })();

(async () => {
    const emptyReviews = await getAllEmptyReview();
    for await (const form of emptyReviews) {
        const rate = extractRateFromReview(form);
        const generatedText = await mockReview(rate);
        form.text = generatedText;
        await form.save();
    }
})();