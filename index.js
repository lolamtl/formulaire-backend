require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

const app = express();

app.use(cors());
app.use(formidable());

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/", (req, res) => {
  const { firstname, lastname, email, subject, message } = req.fields;

  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "lmonteil@live.fr",
    subject: subject,
    text: message,
  };
  console.log(data);

  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      console.log(body);
      return res.status(200).json(body);
    }
    res.status(401).json(error);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
