require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const OpenAI = require("openai");
// const { Messages } = require("openai/resources/beta/threads/messages.mjs");

const port = process.env.PORT || 4000;
let messages = [];
const secretKey = process.env.OPENAI_API_KEY;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// OpenAI configuration
const openai = new OpenAI({
  apiKey: secretKey
})



// ROUTES
app.get("/bob", (req, res) => {
  res.render("index");
});

app.post("/bob", async (req, res) => {

  let { task } = req.body;
  messages.push({ "role": "user", "content": `${task}` })

  try {

    let response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',

      messages: messages,

    });

    

    if (response) {

      let reply = response.choices[0].message.content;

      res.status(200).json({ msg: reply });
    }
    else {

      res.status(404).json({ msg: "Data not found" });

    }

  } catch (error) {

    console.log(error);
    res.status(500).send({ msg: "Something went wrong!" })

  }


  // console.log(response.choices[0].message.content)
})

app.listen(port, () => {
  console.log(`port is listening on http://localhost:${port}/bob`);
});
