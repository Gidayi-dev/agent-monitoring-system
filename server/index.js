import e from "express";
import "dotenv/config";
import eventRoutes from "./routes/events.js"

const app = e()
const PORT = process.env.PORT || 4000

app.use(e.json())
app.use("/events", eventRoutes)

app.get("/", (req, res) => {
    res.send("API ok")
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})