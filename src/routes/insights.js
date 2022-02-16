import { Router } from "express";
import { insights } from "../services/insights.js";
const router = Router();

router.post("/data", async function (req, res) {
  try {
    const postData = req.body;
    let data = await insights(postData);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
