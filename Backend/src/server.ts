import "dotenv/config";
import type {Application, Request, Response} from "express";
import express from "express";
import session from "express-session";
import cors from "cors";
import {search} from './controllers/search.controller.ts';

import {evaluateOffersController} from "./controllers/offer.controller.ts";

const app: Application = express();
const port: string | number = process.env.PORT || 8000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const SESSION_SECRET: string =
    process.env.SESSION_SECRET ?? "dev-secret";

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

// Parse JSONs
app.use(express.json());

// Use Express Session middleware
app.use(
    session({
        name: "flight-search-session",
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true, // true is better for dev, false for prod
        cookie: {
            secure: true, // Set to true if you deploy to HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 1 Day
        }
    })
);

app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK");
})

app.post("/api/search", search);
app.post('/api/offers/evaluate', evaluateOffersController);

app.listen(port, () => {
    console.log("Server running on port " + port);
})