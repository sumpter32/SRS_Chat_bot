import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    // The texts you want to use as the training dataset
    const texts = [
      'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
      'Love your enemies and pray for those who persecute you.',
      'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      'I am the way, the truth, and the life. No one comes to the Father except through me.',
      'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
      ...
    ];

    // Encode the texts as a JSON array
    const data = JSON.stringify({
      model: "text-davinci-002",
      prompt: texts,
    });

    // Create a request object
    const request = new Request("https://api.openai.com/v1/models/text-davinci-002/finetune", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: data,
    });

    // Send the request and get the response
    const response = await fetch(request);

    // Decode the response as a JSON object
    const result = await response.json();

    // Check the status code of the response
    if (result.status.code === 200) {
      // The request was successful
      console.log(`Language model trained: ${result.data.model}`);
    } else {
      // There was an error
      console.error(`Error: ${result.status.message}`);
    }

    // Generate a response using the fine-tuned language model
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
