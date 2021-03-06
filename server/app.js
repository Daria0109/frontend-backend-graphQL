const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3005;

const uri = "mongodb+srv://Darya:Darya123@cluster0.74c97.mongodb.net/GraphQL-tutorial?retryWrites=true&w=majority";

mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => {
    console.log('MongoDB Connectedâ€¦')
  })
  .catch(err => console.log(err))

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(PORT, err => {
  err ? console.log(error) : console.log('server started!')
})