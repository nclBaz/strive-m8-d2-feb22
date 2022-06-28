import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import usersRouter from "./api/users/index.js"

const server = express()

const port = process.env.PORT || 3001

// ************************************** MIDDLEWARES *****************************************

server.use(cors())
server.use(express.json())

// ************************************** ENDPOINTS *******************************************
server.use("/users", usersRouter)

// ************************************* ERROR HANDLERS ***************************************

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
  })
})
