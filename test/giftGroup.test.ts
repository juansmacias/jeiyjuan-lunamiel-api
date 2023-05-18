import { createServer } from '../src/server'
import { GiftType,CurrencyType } from '@prisma/client'
import Hapi from '@hapi/hapi'

import { IGift } from '../src/models/IModels'
import { destroyAllPromise } from './testUtils'

describe('gift group plugin', () => {
  let server:Hapi.Server;

  async function createCity(cityName:string,index:number) {
    const r = await server.app.prisma.city.create({
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

  async function getGiftGroupByName(name:string) {
    return await server.app.prisma.giftGroup.findFirst({where:{name:name}})
  }

  async function createGift(memberName:string,amount:number,currency:CurrencyType,isPrivate:boolean,groupName:string) {
    return await server.app.prisma.gift.create({
        data:{
            memberName:memberName,
            amount:amount,
            currency:currency,
            isPrivate:isPrivate,
            giftGroup:{
                connect:{
                    name:groupName
                }
            }
        }
    })
  }

  async function getLastGift() {
    return await server.app.prisma.gift.findFirst()
  }

  beforeAll(async () => {
    server = await createServer()
    await createCity('city3',1)
    await createCity('city4',2)
    await createGift('JSM',100,CurrencyType.USD,false,'city3-Hospedaje')
    await createGift('JSM',10000,CurrencyType.COP,false,'city4-Hospedaje')
    await createGift('JSM',10000,CurrencyType.COP,true,'city3-Transporte')
  })

  afterAll(async () => {
    await destroyAllPromise(server.app.prisma)
    await server.stop()
  })

  test('GET /giftGroups endpoint returns 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/giftGroups',
    })
    expect(res.statusCode).toEqual(200)
    const response = JSON.parse(res.payload)
  })

  test('GET /giftGroups/{id} endpoint return 200', async () =>{
    const gg = await getGiftGroupByName('city3-Hospedaje')
    const res = await server.inject({
        method: 'GET',
        url: '/giftGroups/'+gg?.id,
      })
      expect(res.statusCode).toEqual(200)
      const response = JSON.parse(res.payload)
      
  })
})