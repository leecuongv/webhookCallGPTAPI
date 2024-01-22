const express = require('express');
const { OpenAIAPI } = require('openai');

const app = express();
const PORT = 3000;

app.use(express.json());

const openai = new OpenAIAPI({
    key: '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', // Thay thế bằng API key của bạn từ OpenAI
});

app.post('/webhook', async (req, res) => {
    try {
        const userQuery = req.body.queryResult.queryText;

        // Gửi yêu cầu đến API của ChatGPT
        const chatGPTResponse = await callChatGPTAPI(userQuery);

        // Trả về kết quả từ ChatGPT cho Dialogflow
        res.json({
            fulfillmentText: chatGPTResponse.choices[0].text,
        });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function callChatGPTAPI(userQuery) {
    const response = await openai.complete.create({
        engine: 'text-davinci-003',
        prompt: userQuery,
        max_tokens: 150,
    });

    return response.data;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
