import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

app.get("/getRoute", async (req, res) => {
  const coordinates = req.query.coordinates;
  const apiKey = "YOUR_API_KEY";
  const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&coordinates=${coordinates}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching route");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
