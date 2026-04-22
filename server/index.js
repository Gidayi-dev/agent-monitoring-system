import e from "express";
import "dotenv/config";

const app = e()
const PORT = process.env.PORT || 4000

app.use(e.json())

app.get("/", (req, res) => {
    res.send("API ok")
});

app.listen(PORT, () => {
    console.log(`Server reunning on port ${PORT}`)
})