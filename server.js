const JsonReader = require("./json-reader")

const data = new JsonReader('./data.json')
let testData = new JsonReader('./data-test.json')
const dataJson = data.read()
testData.write(dataJson)

const RecipeApp = require("./recipe-app")
const port = 3000;
const app = RecipeApp.app(testData);
app.listen(port);
