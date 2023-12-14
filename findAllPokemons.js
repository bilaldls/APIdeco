const pokemons = require('../db/mock-pokemon')
const { Pokemon } = require('../db/sequelize')
const pokemon = require('../models/pokemon')
const { Op } = require ('sequelize')
  
module.exports = (app) => {
  app.get('/api/pokemons', (req, res) => {
    if (req.query.name){
        const name = req.query.name
        const limit = parseInt(req.query.limit) || 5

        if (name.length < 2) {
            const message = 'Le terme de recherche doit contenir au moins 2 caractères'
            return res.status(400).jsont({message})
        }
        return Pokemon.findAndCountAll({
            where: {
                name: { // 'name' est la propriété du modèle pokémon
                    [Op.like]: `%${name}%` // 'name' est le critère de la recherche
                }
            },
            order : ['name'],
            limit: 5 // limite la recherche à 5 pokemons
        })
        .then(({count, rows}) => {
            const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`
            res.json({message, data: rows})
        })
    } else {
        Pokemon.findAll({order : ['name']})
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        const message = `La liste des pokemons n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error})
      })
    }
  })
}