import cors from "cors"
import express from "express"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
