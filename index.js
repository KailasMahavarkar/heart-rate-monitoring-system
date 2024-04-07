import express, { json, text, urlencoded } from "express";
import cors from "cors";

const app = express();

app.use(cors("*"));
app.use(json());
app.use(text());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
	return res.json({
		msg: "server is live 💫",
	});
});

const hookHandler = (req, res) => {
	const queries = req.query;
	const params = req.params;
	const body = req.body;

	const responseObject = {
		msg: "webhook is working!",
		queries,
		params,
		body,
	};

	console.log(Date.now(), responseObject);

	return res.json(responseObject);
};

app.get("/hook", hookHandler);
app.post("/hook", hookHandler);

const PORT = process.env.PORT || 2000;
app.listen(PORT, async () => {
	console.log(`server is listening to port ${PORT}`);
});
