import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

const server = createServer(app);

const io = new Server(server);

app.get("/test", async (req, res) => {
  const inference = new HfInference(process.env.TOKEN); // your user token

  const gpt2 = inference.endpoint(
    "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5"
  );
  const { generated_text } = await gpt2.textGeneration({
    inputs: "The answer to the universe is",
  });

  res.send({
    input: "The answer to the universe is",
    generated_text: generated_text,
  });
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/test`);
});
