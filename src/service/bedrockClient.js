const {
    BedrockRuntimeClient,
    InvokeModelWithResponseStreamCommand,
} = require("@aws-sdk/client-bedrock-runtime");
require('dotenv').config()

const client = new BedrockRuntimeClient({
    region: 'us-east-1',
    credentials: {
        secretAccessKey: process.env.SecretAccessKey,
        accessKeyId: process.env.AccessKey
    }
});
function promptToCommand(prompt) {
    const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';

    const params = {
        body: JSON.stringify({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "system": "你是一名人工智慧助理，熱衷於創意寫作和講故事。 您的任務是與用戶合作創建引人入勝的故事，提供富有想像力的情節曲折",
            "messages": [{
                "role": "user",
                "content": [{ "type": "text", "text": prompt }],
            }],
        }),
        modelId,
        contentType: 'application/json',
    };
    const command = new InvokeModelWithResponseStreamCommand(params)
    return command
}

function promptAttractionToCommand(prompt, query) {
    const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';

    const params = {
        body: JSON.stringify({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "system": `你是一名人工智慧導遊，熱衷於高雄旅遊導覽。 您的任務是與根據提供的資料，介紹並總結高雄旅遊景點，注意排版，請適度斷行，另外也要介紹每個景點的特色，同時請根據用戶的輸入 ${query} 說明這些景點和用戶輸入的關聯性，同時要基於事實`,
            "messages": [{
                "role": "user",
                "content": [{ "type": "text", "text": prompt }],
            }],
        }),
        modelId,
        contentType: 'application/json',
    };
    const command = new InvokeModelWithResponseStreamCommand(params)
    return command
}
module.exports = {
    client,
    promptToCommand,
    promptAttractionToCommand
};