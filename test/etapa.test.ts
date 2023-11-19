import { createServer } from '../src/server'
import { GiftType, PrismaClient } from '@prisma/client'
import Hapi from '@hapi/hapi'

import { destroyAllPromise } from './testUtils'
import { setTestFlag } from './test-helpers'

describe('etapa plugin', () => {
  const OLD_ENV = process.env;

  let server:Hapi.Server;

  async function getFirstEtapa(prisma:PrismaClient) {
    return await prisma.etapa.findFirst()
  }

  beforeAll(async () => {
    setTestFlag(OLD_ENV)
    server = await createServer()
    // await createCity(server.app.prisma,'city1',1)
    // await createCity(server.app.prisma,'city2',2)
  })

  afterAll(async () => {
    await destroyAllPromise(server.app.prisma)
    await server.stop()
    process.env = OLD_ENV;
  })

  it('should return 200 and a list of etapas', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/etapas',
    })
    expect(response.statusCode).toEqual(200)
  })

})