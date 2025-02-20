import express from "express";
import dotenv from "dotenv";
import { getCategories, getQuestionsByCategory, addQuestion } from "./db/db.js";

dotenv.config();
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", "./views");
app.use(express.static("public"));


// Home Page: Show all categories
app.get("/", async (req, res) => {
    try {
        const categories = await getCategories();
        res.render("index", { categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.render("error", { error: "Failed to load categories" });
    }
});

// Category Page: Show questions for a category
app.get("/category/:id", async (req, res) => {
    try {
        const questions = await getQuestionsByCategory(req.params.id);
        res.render("categories", { questions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.render("error", { error: "Failed to load questions" });
    }
});


// Add Question Form
app.get("/add-question", async (req, res) => {
    const categories = await getCategories();
    res.render("add-question", { categories });
});

// Handle new question submission
app.post("/add-question", async (req, res) => {
    try {
        await addQuestion(req.body);
        res.redirect("/");
    } catch (error) {
        res.render("error", { error: "Invalid Data" });
    }
});

// 404 Page
app.use((req, res) => res.status(404).render("404"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
