const {
    ComprehendClient,
    DetectDominantLanguageCommand
} = require("@aws-sdk/client-comprehend");

async function detectLanguageCode(text) {
    const comprehendClient = new ComprehendClient({});

    const detectDominantLanguageCommand = new DetectDominantLanguageCommand({
        Text: text
    });

    // The source language is required for sentiment analysis and
    // translation in the next step.
    const { Languages } = await comprehendClient.send(
        detectDominantLanguageCommand,
    );

    const languageCode = Languages[0].LanguageCode;
    return languageCode
}

async function translateToEn(text, languageCode) {
    const translateClient = new TranslateClient({});

    const translateCommand = new TranslateTextCommand({
        SourceLanguageCode: languageCode,
        TargetLanguageCode: "en",
        Text: text,
    });

    const { TranslatedText } = await translateClient.send(translateCommand);

    return { translated_text: TranslatedText };

}

module.exports = {
    translateToEn,
    detectLanguageCode
}