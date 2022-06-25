const express = require("express")

exports.app = function(dataSource){
    let app = express()
    app.use(express.json()) 
    
    app.get('/recipes', (req, res) => {
        try {
            const data = dataSource.read()
            const recipes = data.recipes
            const names = recipes.map(x => x.name)
            const response = {"recipeNames":names}
            res.status(200).json(response)
        }
        catch (error){
            console.debug(`ERROR: GET /recipes : ${error}`)
        }
    })

    app.get('/recipes/details/:uid', (req, res) => {
        try {
            const data = dataSource.read()
            const recipes = data.recipes
            const search = recipes.filter(x => x.name == req.params.uid)
            if(search.length < 1){
                res.status(200).json({})
            }
            else{
                const recipe = search[0]//take the first, assume that items in data.json have unique names
                const details = { 
                    ingredients: recipe.ingredients, 
                    numSteps: recipe.instructions.length 
                }
                const response = { "details": details }
                res.status(200).json(response)
            }
        }
        catch (error){
            console.debug( `ERROR: GET /recipes/details/${req.params.uid} : ${error}`)
        }
    })

    app.post('/recipes', function(req, res){
        try {
            const body = req.body
            const newRecipe = body
            if(!('name' in newRecipe)){
                res.status(400).json({'error':'Recipe missing name'})
                throw('Missing name')
            } 
            if(!('ingredients' in newRecipe)){
                res.status(400).json({'error':'Recipe missing ingredients'})
                throw('Missing ingredients')
            } 
            if(!('instructions' in newRecipe)){
                res.status(400).json({'error':'Recipe missing instructions'})
                throw('Missing instructions')
            } 
            const data = dataSource.read()
            const recipes = data.recipes
            const found = recipes.find(x => x.name == newRecipe.name)
            if(!found){
                data.recipes.push(newRecipe)
                dataSource.write(data)
                res.sendStatus(201)
            }
            else{
                res.status(400).json({'error':'Recipe already exists'})
                throw('Recipe already exists')
            }
        }
        catch (error){
            console.debug(`ERROR: POST /recipes : ${error}`)
        }
    })

    app.put('/recipes', function(req, res){
        try {
            const body = req.body
            const newRecipe = body
            if(!('name' in newRecipe)){
                res.status(400).json({'error':'Recipe missing name'})
                throw('Missing name')
            } 
            if(!('ingredients' in newRecipe)){
                res.status(400).json({'error':'Recipe missing ingredients'})
                throw('Missing ingredients')
            } 
            if(!('instructions' in newRecipe)){
                res.status(400).json({'error':'Recipe missing instructions'})
                throw('Missing instructions')
            } 
            const data = dataSource.read()
            const recipes = data.recipes
            const found = recipes.find(x => x.name == newRecipe.name)
            if(found){
                Object.assign(found, newRecipe)
                dataSource.write(data)
                res.sendStatus(204)
            }
            else{
                res.status(404).json({'error':'Recipe does not exist'})
                throw('Recipe does not exist')
            }
        }
        catch (error){
            console.debug(`ERROR: PUT /recipes : ${error}`)
        }
    })

    return app
}

