import { createServer } from '../src/server'
import { GiftType,CurrencyType } from '@prisma/client'
import Hapi from '@hapi/hapi'

import { IGift } from '../src/models/IModels'
import { destroyAllPromise } from './testUtils'

describe('gift plugin', () => {
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

  async function getLastCity() {
    return await server.app.prisma.city.findFirst()
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
    await createCity('city1',1)
    await createCity('city2',2)
    await createGift('JSM',100,CurrencyType.USD,false,'city2-Hospedaje')
    await createGift('JSM',10000,CurrencyType.COP,false,'city1-Hospedaje')
    await createGift('JSM',10000,CurrencyType.COP,true,'city1-Transporte')
  })

  afterAll(async () => {
    await destroyAllPromise(server.app.prisma)
    await server.stop()
  })

  test('GET /gifts endpoint returns 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/gifts',
    })
    expect(res.statusCode).toEqual(200)
    const response = JSON.parse(res.payload)
    expect(response.length).toEqual(3)
  })

  test('GET /gifts/{id} endpoint return 200', async () =>{
    const gift = await getLastGift()
    const res = await server.inject({
        method: 'GET',
        url: '/gifts/'+gift?.id,
      })
      expect(res.statusCode).toEqual(200)
      const response = JSON.parse(res.payload)
      
  })

  test('GET /gifts/member/{memberName} endpoint return 200', async () => {
    const memberName = 'JSM'
    const res = await server.inject({
        method: 'GET',
        url: '/gifts/member/'+memberName,
      })
      expect(res.statusCode).toEqual(200)
      const response = JSON.parse(res.payload)
  })

  test('POST /gifts endpoint return 200',async () =>{
    const gift = {
        memberName:`JAM-${Math.floor(Math.random() * 9999999)}`,
        amount:100,
        giftGroupName: 'city2-Transporte',
        isPrivate:false,
        currency: CurrencyType.USD
    }
    const res = await server.inject({
        method: 'POST',
        url:'/gifts',
        payload: gift
    })
    expect(res.statusCode).toEqual(200)
    const response = JSON.parse(res.payload) as IGift
    expect(response.id).toBeTruthy
  })
})