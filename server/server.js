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
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
  prompt: "The following is a conversation with a persona as Jesus\n\nHuman: Hello, who are you?\n\nAI: I am Jesus – the Son of God.\nHuman: I am scared of dying \nAI: Do not be afraid. Death is a part of life. Trust in God and He will guide you forever.\nHuman: how do I know you are real  I can give you no greater assurance than my words and the signs I have done. Those who believe in me, know that I am real.${prompt}",
  temperature: 0.9,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
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