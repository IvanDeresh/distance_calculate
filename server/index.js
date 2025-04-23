import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "5b3ce3597851110001cf62485396a3cd012c46e1b0222162de252b7d";

app.post("/api/route", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      req.body,
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Route fetching failed" });
  }
});

app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));
