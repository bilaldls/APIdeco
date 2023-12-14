const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')

const app = express()
const port = 3000

//Middleware, qui affiche l'URL des requètes entrantes vers l'API Rest: 
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

sequelize.initDb()

//Ici nous placerons nos futurs point de terminaison

require('./src/routes/findAllPokemons')(app) //'app' est l'application Express
require('./src/routes/findPokemonsByPk')(app)
require('./src/routes/createPokemons')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)
require('./src/routes/login')(app)

//ajout de la gestion d'erreur 404:
app.use(({res})=> {
    const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.'
    res.status(404).json({message})
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`)) 
