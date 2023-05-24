const fs = require("fs/promises");
const express = require("express");
const { v4: uuid } = require("uuid");
const axios = require('axios');

const app = express();

app.use(express.json());

app.get("/cafes/frase", async (req, res) => {
	const URL = "https://api.adviceslip.com/advice";
	try {
		await axios.get(URL).then(response => {
      res.json({
        mensagem: response.data.slip.advice
      });
    });
	} catch (err) {
		return res.sendStatus(500);
	}
});

app.get("/cafes/:id", async (req, res) => {
	const id = req.params.id;
	let content;

	try {
		content = await fs.readFile(`data/cafes/${id}.txt`, "utf-8");
	} catch (err) {
		return res.sendStatus(404);
	}

	res.json({
		body: JSON.parse(content)
	});
});

app.post("/cafes", async (req, res) => {
	const id = uuid();
	const content = req.body;

	if (!content) {
		return res.sendStatus(400);
	}

	await fs.mkdir("data/cafes", { recursive: true });
	await fs.writeFile(`data/cafes/${id}.txt`, JSON.stringify(content));

	res.status(201).json({
		id: id
	});
});

app.listen(3000, () => console.log("API Server is running..."));