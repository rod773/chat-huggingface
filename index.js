import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

const server = createServer(app);

const io = new Server(server);

app.get("/test", (req, res) => {
  res.send("this is a test");
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/test`);
});

const inference = new HfInference(process.env.TOKEN); // your user token

const gpt2 = inference.endpoint(
  "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5"
);
const { generated_text } = await gpt2.textGeneration({
  inputs: "The answer to the universe is",
});

console.log(generated_text);
