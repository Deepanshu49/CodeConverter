const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI client with your API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API route for code conversion
app.post("/convert", async (req, res) => {
  const { code, targetLang } = req.body;

  if (!code || !targetLang) {
    return res.status(400).json({ error: "Code and target language are required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a strict code converter. Convert the user's code into ${targetLang}. 
          Do not include explanations, only return the converted ${targetLang} code.`
        },
        { role: "user", content: code }
      ]
    });

    const converted = response.choices[0].message.content.trim();
    res.json({ convertedCode: converted });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Something went wrong while converting code." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});