import { createServer, startServer } from './server'
if(process.env.NODE_ENV !== 'production')
  require('dotenv').config({override:true})

createServer()
  .then(startServer)
  .catch(err => {
    console.log(err)
  })