import express from "express";
import cors from "cors";
import { pipeline } from "@xenova/transformers";

const app = express();
app.use(express.json());
app.use(cors());

// Load model khusus Bahasa Indonesia
let model;
async function loadModel() {
    model = await pipeline("text-generation", "cahya/gpt2-small-indonesian-522M");
    console.log("Model AI Bahasa Indonesia siap!");
}
loadModel();

// Endpoint chat
app.get("/chat", async (req, res) => {
    if (!model) return res.status(503).json({ error: "Model masih loading, coba lagi bentar!" });

    const teks = req.query.text;
    if (!teks) return res.status(400).json({ error: "Masukin teks dulu, bro!" });

    try {
        const output = await model(teks, { max_new_tokens: 50 });
        res.json({ jawaban: output[0].generated_text });
    } catch (error) {
        res.status(500).json({ error: "Ada error di AI, coba lagi!" });
    }
});

export default app;