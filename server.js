const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8000;
const app = express();
const Event = require("./Schema/EventSchema");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json("Olá mundo");
});

// Criar evento - POST
app.post("/event", async (req, res) => {
    try {
        const { name, description, date, location, organizer } = req.body;
        const event = { name, description, date, location, organizer };
        const eventCreated = await Event.create(event);
        res.status(201).json({ message: "Evento criado com sucesso", event: eventCreated });
    } catch (error) {
        console.log("Erro ao criar evento", error);
        res.status(500).json({ message: "Erro ao criar evento", erro: error });
    }
});

// Buscar todos os eventos - GET
app.get("/getEvent", async (req, res) => {
    try {
        const result = await Event.find();
        if (result.length === 0) {
            return res.status(404).json({ message: 'Nenhum evento encontrado' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Problemas ao consultar o banco de dados', erro: error });
    }
});

// Deletar evento - DELETE
app.delete("/delEvent/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const eventDeleted = await Event.findByIdAndDelete(id);
        if (!eventDeleted) {
            return res.status(404).json({ message: 'Evento não encontrado, verifique o id do evento' });
        }
        res.status(200).json({ message: 'Evento deletado com sucesso', event: eventDeleted });
    } catch (error) {
        res.status(500).json({ message: 'Problemas ao deletar no banco de dados', erro: error });
    }
});

// Atualizar evento - PUT
app.put("/putEvent/:id", async (req, res) => {
    const eventId = req.params.id;
    const { name, description, date, location, organizer } = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { name, description, date, location, organizer },
            { new: true, runValidators: true } // Garante que o documento atualizado seja retornado
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        res.status(200).json({ message: `Evento com Id ${updatedEvent._id} atualizado com sucesso`, event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o evento', erro: error });
    }
});

// Buscar evento por ID - GET
app.get("/getEvent/:id", async (req, res) => {
    const eventId = req.params.id;
    try {
        const eventDetail = await Event.findById(eventId);
        if (!eventDetail) {
            return res.status(404).json({ message: "Evento não encontrado" });
        }
        res.status(200).json(eventDetail);
    } catch (error) {
        console.log("Erro ao pegar um evento", error);
        res.status(500).json({ message: "Erro ao pegar um evento", erro: error });
    }
});

mongoose.connect("mongodb+srv://loidpadre:QCjXHMS3nBA5xeGI@bdevents.tixiz.mongodb.net/?retryWrites=true&w=majority&appName=bdEvents")
    .then(() => {
        app.listen(PORT, () => {
            console.log("API rodando e banco de dados conectado", PORT);
        });
    })
    .catch((error) => {
        console.log("Erro ao se conectar com a base de dados", error);
    });
