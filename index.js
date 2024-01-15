import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const inference = new HfInference(process.env.HF_TOKEN); // your user token

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

const server = createServer(app);

const io = new Server(server);

const gpt2 = inference.endpoint(
  "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5"
);

app.get("/api", async (req, res) => {
  res.send({
    message: "chat-hugingface",
  });
});

app.post("/api", async (req, res) => {
  const question = req.body.question;

  const { generated_text } = await gpt2.textGeneration({
    inputs: question,
  });

  res.send({
    input: question,
    generated_text: generated_text,
  });
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/api`);
});
