import Hapi from '@hapi/hapi'
import statusPlugin from './plugins/status'
import prismaPlugin from './plugins/prisma'
import CityPlugin from './plugins/city'
import GiftPlugin from './plugins/gift'

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3030,
  host: process.env.HOST || 'localhost',
  routes: {
    cors: {
      origin:['*'],
    }
  } 
})

export async function createServer(): Promise<Hapi.Server> {

  const pianoOptions = {
    logEvents: (process.env.CI === 'true' || process.env.TEST === 'true'||process.env.NODE_ENV === 'test') ? false : undefined,
    prettyPrint: process.env.NODE_ENV !== 'production',
    // Redact Authorization headers, see https://getpino.io/#/docs/redaction
    redact: ['req.headers.authorization'],
  }

  await server.register({
    plugin: require('hapi-pino'),
    options: pianoOptions
  })
  
  await server.register(
    [ 
      statusPlugin,
      prismaPlugin,
      CityPlugin,
      GiftPlugin
    ])

  await server.initialize()

  return server
}
  
export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
  await server.start()
  console.log(`Server running on ${server.info.uri}`)
  return server
}


process.on('unhandledRejection', err => {
    console.log(err)
    process.exit(1)
  })