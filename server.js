onst express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Serve frontend files (index.html, css, js)
app.use(express.static(path.join(__dirname)));

// API route
app.post("/convert", async (req, res) => {
  const { code, targetLang } = req.body;

  if (!code || !targetLang) {
    return res.status(400).json({ error: "Code and target language are required." });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content:` Convert this code strictly to ${targetLang}. Return only code.` },
        { role: "user", content: code }
      ]
    });

    res.json({ convertedCode: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Fallback → for any unknown route, return index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
