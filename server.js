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

app.get('/getEvent', async (req, res) =>{
    try {
        const result = await Event.find()

        if(!result){
            res.json({message:'Nenhum evento encontrado'})
        }
        // adicionando o status 200 ao entregar os dados
        res.status(200).json(result)
        
    } catch (error) {
        res.status(500).json({message:'Problemas ao consultar o banco de dados', erro: error})
    }
})


 // criei uma rota para deletar evento usando o id como parametro
app.delete('/delEvent/:id', async (req, res) =>{
    // ao pegar o ID, é conveniete que vc pegue diretamente da rota: req.params.id
    const id = req.params.id
   try {
    const eventDeleted = await Event.findOneAndDelete({ id: id})
    if(!eventDeleted){
        res.status(404).json({message: 'Evento não encontrado, verifique o id do evento'})
    }
    res.status(200).json({message:'Evento deletado com sucesso', event: eventDeleted})
   } catch (error) {
    res.status(503).json({message: 'Problemas ao deletar no banco de dados', erro: error})
   }
   
})

// rota para atualizar, precisa ser melhorada, só altera um registro, creio que seja o findOneAndUpdate que estou a usar

app.put('/putEvent/:id', async (req, res) => {
    const eventId = req.params.id;
    const { name, description, date, location, organizer } = req.body;

    try {
        // Verificar se o evento existe e atualizar apenas os campos fornecidos
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                name: name,
                description: description,
                date: date,
                location: location,
                organizer: organizer
             },
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        res.status(200).json({ message: `Evento com Id ${updatedEvent._id} atualizado com sucesso`, event: updatedEvent });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o evento', error });
    }
});






mongoose.connect("mongodb+srv://loidpadre:QCjXHMS3nBA5xeGI@bdevents.tixiz.mongodb.net/?retryWrites=true&w=majority&appName=bdEvents").then(() =>{
    app.listen(PORT, () =>{
        console.log("API rodando e banco de dados conectado", PORT)
    })
}).catch((error) =>{
    console.log("erro ao se conectar com a bd", error)
})
