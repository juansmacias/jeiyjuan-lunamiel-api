import { createServer } from '../src/server'
import { GiftType, PrismaClient } from '@prisma/client'
import Hapi from '@hapi/hapi'

import { destroyAllPromise } from './testUtils'
import { setTestFlag } from './test-helpers'

describe('city plugin', () => {
  const OLD_ENV = process.env;

  let server:Hapi.Server;

  async function createCity(prisma:PrismaClient,cityName:string,index:number) {
    const r = await prisma.city.create({
        data:{
            name:cityName,
            description:cityName+'-Desc',
            index:index,
            startDate:new Date(),
            endDate:new Date(),
            giftGroups:{
                createMany:{
                    data:[{
                        name:cityName+'-Hospedaje',
                        type:GiftType.ACOMODATION,
                        numMaxGifts:5,
                    },{
                        name:cityName+'-Transporte',
                        type:GiftType.TRANSPORTATION,
                        numMaxGifts:5,
                    },{
                        name:cityName+'-Alimentacion',
                        type:GiftType.FOOD,
                        numMaxGifts:5,
                    },{
                        name:cityName+'-Actividades',
                        type:GiftType.ACTIVITIY,
                        numMaxGifts:15,
                    }]
                }
            }
        }
    })
  }

  async function getLastCity(prisma:PrismaClient) {
    return await prisma.city.findFirst()
  }

  beforeAll(async () => {
    setTestFlag(OLD_ENV)
    server = await createServer()
    await createCity(server.app.prisma,'city1',1)
    await createCity(server.app.prisma,'city2',2)
  })

  afterAll(async () => {
    await destroyAllPromise(server.app.prisma)
    await server.stop()
    process.env = OLD_ENV;
  })

  test('GET /cities endpoint returns 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/cities',
    })
    expect(res.statusCode).toEqual(200)
    const response = JSON.parse(res.payload)
    expect(response.length).toEqual(2)
  })

  test('GET /cities/{id} endpoint return 200', async () =>{
    const city = await getLastCity(server.app.prisma)
    const res = await server.inject({
        method: 'GET',
        url: '/cities/'+city?.id,
      })
      expect(res.statusCode).toEqual(200)
      const response = JSON.parse(res.payload)
      
  })
})