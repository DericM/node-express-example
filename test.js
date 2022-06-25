const recipeApp = require("./recipe-app")
var request = require('supertest')
var expect = require('chai').expect

const JsonReader = require("./json-reader")
const data = new JsonReader('./data.json')
const dataJson = data.read()
const testData = new JsonReader('./data-test.json')

describe('Test the GET endpoints', function() {
    var app
  
    before(function(done) {
      testData.write(dataJson)
      app = recipeApp.app(testData)
      app.listen(function(err) {
        if (err) { return done(err) }
        done()
      })
    })
  
    let message = `Try to get a list of all recipes
    \t Request:
    \t   Endpoint: @GET /recipes
    \t Response:
    \t   Status: 200
    \t   Body: (JSON) {
    \t     reicpeNames:["scrambledEggs", "garlicPasta", "chai"]
    \t   }
    `
    it(message, function(done) {
      request(app)
        .get('/recipes')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) { return done(err) }
          body = res.body
          expect("recipeNames" in body).to.equal(true)
          recipeNames = body.recipeNames
          expect(recipeNames.includes("scrambledEggs")).to.equal(true)
          expect(recipeNames.includes("garlicPasta")).to.equal(true)
          expect(recipeNames.includes("chai")).to.equal(true)
          done()
        })
    })

    message = `Try to get the details of the scrambledEggs recipe
    \t Request:
    \t   Endpoint: @GET /recipes/details/scrambledEggs
    \t Response:
    \t   Status: 200
    \t   Body: (JSON) {
    \t     details {
    \t       ingredients:["1 tsp oil", "2 eggs", "Salt" ]
    \t       numSteps:5
    \t     }
    \t   }
    `
    it(message, function(done) {
        request(app)
          .get('/recipes/details/scrambledEggs')
          .expect('Content-Type', /json/)
          .expect(200, function(err, res) {
            if (err) { return done(err) }
            const body = res.body
            expect("details" in body).to.equal(true)
            const details = body.details
            expect("ingredients" in details).to.equal(true)
            expect("numSteps" in details).to.equal(true)
            const ingredients = details.ingredients
            expect(ingredients.includes("1 tsp oil")).to.equal(true)
            expect(ingredients.includes("2 eggs")).to.equal(true)
            expect(ingredients.includes("salt")).to.equal(true)
            const numSteps = details.numSteps
            expect(numSteps).to.equal(5)
            done()
        })
    })

    message = `Try to get the details of the garlicPasta recipe
    \t Request:
    \t   Endpoint: @GET /recipes/details/garlicPasta
    \t Response:
    \t   Status: 200
    \t   Body: (JSON) { 
    \t     details {
    \t       ingredients:["500mL water", "100g spaghetti", "25mL olive oil", "4 cloves garlic", "Salt" ]
    \t       numSteps:5
    \t     }
    \t   }
    `
    it(message, function(done) {
        request(app)
          .get('/recipes/details/garlicPasta')
          .expect('Content-Type', /json/)
          .expect(200, function(err, res) {
            if (err) { return done(err) }
            const body = res.body
            expect("details" in body).to.equal(true)
            const details = body.details
            expect("ingredients" in details).to.equal(true)
            expect("numSteps" in details).to.equal(true)
            const ingredients = details.ingredients
            expect(ingredients.includes("500mL water")).to.equal(true)
            expect(ingredients.includes("100g spaghetti")).to.equal(true)
            expect(ingredients.includes("25mL olive oil")).to.equal(true)
            expect(ingredients.includes("4 cloves garlic")).to.equal(true)
            expect(ingredients.includes("Salt")).to.equal(true)
            const numSteps = details.numSteps
            expect(numSteps).to.equal(5)
            done()
        })
    })

    message = `Try to get the details of the chai recipe
    \t Request:
    \t   Endpoint: @GET /recipes/details/chai
    \t Response:
    \t   Status: 200
    \t   Body: (JSON) {  
    \t     details {
    \t       ingredients:["400mL water", "100mL milk", "5g chai masala", "2 tea bags or 20 g loose tea leaves"]
    \t       numSteps:4
    \t     }
    \t   }
    `
    it(message, function(done) {
        request(app)
          .get('/recipes/details/chai')
          .expect('Content-Type', /json/)
          .expect(200, function(err, res) {
            if (err) { return done(err) }
            const body = res.body
            expect("details" in body).to.equal(true)
            const details = body.details
            expect("ingredients" in details).to.equal(true)
            expect("numSteps" in details).to.equal(true)
            const ingredients = details.ingredients
            expect(ingredients.includes("400mL water")).to.equal(true)
            expect(ingredients.includes("100mL milk")).to.equal(true)
            expect(ingredients.includes("5g chai masala")).to.equal(true)
            expect(ingredients.includes("2 tea bags or 20 g loose tea leaves")).to.equal(true)
            const numSteps = details.numSteps
            expect(numSteps).to.equal(4)
            done()
        })
    })

    message = `Try to get the details of a recipe that dosent exist
    \t Request:
    \t   Endpoint: @GET /recipes/details/nonexistant
    \t Response:
    \t   Status: 200
    \t   Body: (JSON) {}
    `
    it(message, function(done) {
        request(app)
          .get('/recipes/details/nonexistant')
          .expect('Content-Type', /json/)
          .expect(200, function(err, res) {
            if (err) { return done(err) }
            const body = res.body
            expect(body && Object.keys(body).length == 0).to.equal(true)
            done()
        })
    })
})

describe('Test the POST endpoint', function() {
  var app

  before(function(done) {
      testData.write(dataJson)
      app = recipeApp.app(testData)
      app.listen(function(err) {
      if (err) { return done(err) }
      done()
      })
  })

  let message = `Try to add a new recipe
  \t Request:
  \t   Endpoint: @POST /recipes
  \t   Body: {
  \t     "name": "butteredBagel", 
  \t     "ingredients": ["1 bagel", "butter"], 
  \t     "instructions": ["cut the bagel", "spread butter on bagel"]
  \t   }
  \t Response:
  \t   Status: 201
  \t   Body: None
  `
  it(message, function(done) {
      request(app)
        .post('/recipes')
        .send({
          "name": "butteredBagel", 
          "ingredients": [
            "1 bagel", 
            "butter"
          ], 
          "instructions": [
            "cut the bagel", 
            "spread butter on bagel"
          ]
        })
        .expect(201, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect(body && Object.keys(body).length == 0).to.equal(true)
          done()
      })
  })

  message = `Try to add a recipe when it already exists
  \t Request:
  \t   Endpoint: @POST /recipes
  \t   Body: {
  \t     "name": "butteredBagel", 
  \t     "ingredients": ["1 bagel", "butter"], 
  \t     "instructions": ["cut the bagel", "spread butter on bagel"]
  \t   }
  \t Response:
  \t   Status: 400
  \t   Body: (JSON) {"error":"Recipe already exists"}
  `
  it(message, function(done) {
      request(app)
        .post('/recipes')
        .send({
          "name": "butteredBagel", 
          "ingredients": [
            "1 bagel", 
            "butter"
          ], 
          "instructions": [
            "cut the bagel", 
            "spread butter on bagel"
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect("error" in body).to.equal(true)
          const error = body.error
          expect(error).to.equal("Recipe already exists")
          done()
      })
  })

  message = `Try to add a recipe when the name is missing
  \t Request:
  \t   Endpoint: @POST /recipes
  \t   Body: {
  \t     "ingredients": ["1 bagel", "butter"], 
  \t     "instructions": ["cut the bagel", "spread butter on bagel"]
  \t   }
  \t Response:
  \t   Status: 400
  \t   Body: (JSON) {"error":"Recipe missing name"}
  `
  it(message, function(done) {
      request(app)
        .post('/recipes')
        .send({
          "ingredients": [
            "1 bagel", 
            "butter"
          ], 
          "instructions": [
            "cut the bagel", 
            "spread butter on bagel"
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect("error" in body).to.equal(true)
          const error = body.error
          expect(error).to.equal("Recipe missing name")
          done()
      })
  })

  message = `Try to add a recipe when the ingredients are missing
  \t Request:
  \t   Endpoint: @POST /recipes
  \t   Body: {
  \t     "name": "butteredBagel", 
  \t     "instructions": ["cut the bagel", "spread butter on bagel"]
  \t   }
  \t Response:
  \t   Status: 400
  \t   Body: (JSON) {"error":"Recipe missing ingredients"}
  `
  it(message, function(done) {
      request(app)
        .post('/recipes')
        .send({
          "name": "butteredBagel", 
          "instructions": [
            "cut the bagel", 
            "spread butter on bagel"
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect("error" in body).to.equal(true)
          const error = body.error
          expect(error).to.equal("Recipe missing ingredients")
          done()
      })
  })

  message = `Try to add a recipe when the instructions are missing
  \t Request:
  \t   Endpoint: @POST /recipes
  \t   Body: {
  \t     "name": "butteredBagel", 
  \t     "ingredients": ["1 bagel", "butter"], 
  \t   }
  \t Response:
  \t   Status: 400
  \t   Body: (JSON) {"error":"Recipe missing instructions"}
  `
  it(message, function(done) {
      request(app)
        .post('/recipes')
        .send({
          "name": "butteredBagel", 
          "ingredients": [
            "1 bagel", 
            "butter"
          ], 
        })
        .expect('Content-Type', /json/)
        .expect(400, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect("error" in body).to.equal(true)
          const error = body.error
          expect(error).to.equal("Recipe missing instructions")
          done()
      })
  })

  message = `Check if butteredBagel has been added to the test data
    \t Request:
    \t   Endpoint: @GET /recipes/details/butteredBagel
    \t Response:
    \t   Status: 200
    \t   Body: (JSON) { 
    \t     details {
    \t       ingredients:["1 bagel","butter"]
    \t       numSteps:2
    \t     }
    \t   }
    `
    it(message, function(done) {
        request(app)
          .get('/recipes/details/butteredBagel')
          .expect('Content-Type', /json/)
          .expect(200, function(err, res) {
            if (err) { return done(err) }
            const body = res.body
            expect("details" in body).to.equal(true)
            const details = body.details
            expect("ingredients" in details).to.equal(true)
            expect("numSteps" in details).to.equal(true)
            const ingredients = details.ingredients
            expect(ingredients.includes("1 bagel")).to.equal(true)
            expect(ingredients.includes("butter")).to.equal(true)
            const numSteps = details.numSteps
            expect(numSteps).to.equal(2)
            done()
        })
    })
})

describe('Test the PUT endpoints', function() {
  var app

  before(function(done) {
      testData.write(dataJson)
      app = recipeApp.app(testData)
      app.listen(function(err) {
      if (err) { return done(err) }
      done()
      })
  })
  
  let message = `Try to add a recipe
  \t Request:
  \t   Endpoint: @POST /recipes
  \t   Body: {
  \t     "name": "butteredBagel", 
  \t     "ingredients": ["1 bagel", "butter"], 
  \t     "instructions": ["cut the bagel", "spread butter on bagel"]
  \t   }
  \t Response:
  \t   Status: 201
  \t   Body: None
  `
  it(message, function(done) {
      request(app)
        .post('/recipes')
        .send({
          "name": "butteredBagel", 
          "ingredients": [
            "1 bagel", 
            "butter"
          ], 
          "instructions": [
            "cut the bagel", 
            "spread butter on bagel"
          ]
        })
        .expect(201, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect(body && Object.keys(body).length == 0).to.equal(true)
          done()
      })
  })

  message = `Try to update a recipe
  \t Request:
  \t   Endpoint: @PUT /recipes
  \t   Body: {
  \t     "name": "butteredBagel", 
  \t     "ingredients": ["1 bagel", "2 tbsp butter"], 
  \t     "instructions": ["cut the bagel", "spread butter on bagel"]
  \t   }
  \t Response:
  \t   Status: 204
  \t   Body: None
  `
  it(message, function(done) {
      request(app)
        .put('/recipes')
        .send({
          "name": "butteredBagel", 
          "ingredients": [
            "1 bagel", 
            "2 tbsp butter"
          ], 
          "instructions": [
            "cut the bagel", 
            "spread butter on bagel"
          ]
        })
        .expect(204, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect(body && Object.keys(body).length == 0).to.equal(true)
          done()
      })
  })

  message = `Check if butteredBagel has been updated
  \t Request:
  \t   Endpoint: @GET /recipes/details/butteredBagel
  \t Response:
  \t   Status: 200
  \t   Body: (JSON) { 
  \t     details {
  \t       ingredients:["1 bagel","2 tbsp butter"]
  \t       numSteps:2
  \t     }
  \t   }
  `
  it(message, function(done) {
      request(app)
        .get('/recipes/details/butteredBagel')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect("details" in body).to.equal(true)
          const details = body.details
          expect("ingredients" in details).to.equal(true)
          expect("numSteps" in details).to.equal(true)
          const ingredients = details.ingredients
          expect(ingredients.includes("1 bagel")).to.equal(true)
          expect(ingredients.includes("2 tbsp butter")).to.equal(true)
          const numSteps = details.numSteps
          expect(numSteps).to.equal(2)
          done()
      })
  })

  message = `Try to update a recipe that does not exist
  \t Request:
  \t   Endpoint: @PUT /recipes
  \t   Body: {
  \t     "name": "nonexistant", 
  \t     "ingredients": ["non"], 
  \t     "instructions": ["non"]
  \t   }
  \t Response:
  \t   Status: 404
  \t   Body: (JSON) {"error":"Recipe does not exist"}
  `
  it(message, function(done) {
      request(app)
        .put('/recipes')
        .send({
          "name": "nonexistant", 
          "ingredients": [
            "non"
          ], 
          "instructions": [
            "non"
          ]
        })
        .expect('Content-Type', /json/)
        .expect(404, function(err, res) {
          if (err) { return done(err) }
          const body = res.body
          expect("error" in body).to.equal(true)
          const error = body.error
          expect(error).to.equal("Recipe does not exist")
          done()
      })
  })
})
