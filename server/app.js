const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const PORT = 3005;

const uri = "mongodb+srv://Darya:Darya123@cluster0.74c97.mongodb.net/GraphQL-tutorial?retryWrites=true&w=majority";

mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => {
    console.log('MongoDB Connected…')
  })
  .catch(err => console.log(err))

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))
app.listen(PORT, err => {
  err ? console.log(error) : console.log('server started!')
})