const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const PORT = 8000
const app = express()
const Event = require("./Schema/EventSchema")

app.use(cors())
app.use(express.json())


app.get("/", (req, res) =>{
    res.json("Ola mundo")
})

// criando a rota de eventos - POST


app.post("/event", async (req, res) =>{
    try {
        const {name, description, date, location, organizer} = req.body
        const event = {
            name,
            description,
            date,
            location,
            organizer
        }
        const eventCreated = await Event.create(event)
        res.status(201).json({ message: "Evento criado com sucesso", event: eventCreated });
        
    } catch (error) {
        console.log("erro ao criar evento", error)
        res.status(500).json({message: "erro ao criar evento", erro: error})
    }
})


// rota para buscar eventos










mongoose.connect("mongodb+srv://loidpadre:QCjXHMS3nBA5xeGI@bdevents.tixiz.mongodb.net/?retryWrites=true&w=majority&appName=bdEvents").then(() =>{
    app.listen(PORT, () =>{
        console.log("API rodando e banco de dados conectado", PORT)
    })
}).catch((error) =>{
    console.log("erro ao se conectar com a bd", error)
})
