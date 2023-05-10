import _ from 'lodash'
require('dotenv').config({override:true})
import { PrismaClient,GiftType,CurrencyType } from '@prisma/client'
import { ICity,IGift } from '../models/IModels'

const prisma = new PrismaClient()
const cities:ICity[] = [{
    name:'Bogota, CO',
    description:'Desc Bogota',
    index:1,
    startDate:new Date(2023,6,8,8,19),
    endDate:new Date(2023,6,8,23,12,0)
},{
    name:'Cancun',
    description:'Desc Cancun',
    index:2,
    startDate:new Date(2023,6,8,12,0),
    endDate:new Date(2023,6,12,11,20)
},{
    name:'Houston, TX',
    description:'Desc Houston',
    index:3,
    startDate:new Date(2032,6,12,15,0),
    endDate:new Date(2023,6,14,12,0)
},{
    name:'Las Vegas, AZ',
    description:'Desc Las Vegas',
    index:4,
    startDate:new Date(2023,6,14,14,0),
    endDate:new Date(2023,6,17,8,0)
},{
    name:'Salt Lake City, ',
    description:'Desc Salt Lake City',
    index:5,
    startDate:new Date(2023,6,17,10,0),
    endDate:new Date(2023,6,18,18,0)
},{
    name:'Parque Nacional Yellowstone, UT',
    description:'desc Parque Nacional Yellowstone',
    index:6,
    startDate:new Date(2023,6,18,18,0),
    endDate:new Date(2023,6,22,7,0)
},{
    name:'Dallas, TX',
    description:'desc Dallas',
    index:9,
    startDate:new Date(2023,6,22,7,0),
    endDate:new Date(2023,6,23,7,0)
},{
    name:'Austin, TX',
    description:'Desc Austin',
    index:10,
    startDate:new Date(2023,6,24,7,0),
    endDate:new Date(2023,6,29,10,40)
},{
    name:'Casa',
    description:'Desc bog',
    index:11,
    startDate:new Date(2023,6,29,10,40),
    endDate:new Date(2023,6,30,1,10)
}]

export async function destroyAllPromise() {
    // if(process.env.TEST === 'true'){
  
      const delete1 = prisma.gift.deleteMany({})
      const delete2 = prisma.giftGroup.deleteMany({})
      const delete3 = prisma.city.deleteMany({})
  
      return prisma.$transaction([delete1,delete2,delete3])
    // }
  
    return
}

async function createGift(memberName:string,amount:number,currency:CurrencyType, giftGroupName:string,isPrivate:boolean) {
    await prisma.gift.create({
        data:{
            memberName:memberName,
            amount:amount,
            currency:currency,
            isPrivate:isPrivate,
            giftGroup:{
                connect:{
                    name:giftGroupName
                }
            }
        }
    })
}

// A `main` function so that we can use async/await
async function main() {
    // await destroyAllPromise()

    for( const city of cities){
        console.log('city: ',city)
        const r = await prisma.city.create({
            data:{
                name:city.name!,
                description:city.description!,
                index:city.index!,
                startDate:city.startDate!,
                endDate:city.endDate!,
                giftGroups:{
                    createMany:{
                        data:[{
                            name:city.name!+'-Hospedaje',
                            type:GiftType.ACOMODATION,
                            numMaxGifts:5,
                        },{
                            name:city.name!+'-Transporte',
                            type:GiftType.TRANSPORTATION,
                            numMaxGifts:5,
                        },{
                            name:city.name!+'-Alimentacion',
                            type:GiftType.FOOD,
                            numMaxGifts:5,
                        },{
                            name:city.name!+'-Actividades',
                            type:GiftType.ACTIVITIY,
                            numMaxGifts:15,
                        }]
                    }
                }
            }
        })
    }
  
    await createGift('FAM Macias & Morillo',100000,CurrencyType.COP,'Cancun-Hospedaje',false)
    await createGift('FAM Macias & Morillo',100,CurrencyType.USD,'Cancun-Actividades',false)
    await createGift('FAM Macias & Morillo',50,CurrencyType.USD,'Cancun-Transporte',true)

}
  
main()
.catch((e: Error) => {
    console.error(e)
    process.exit(1)
})
.finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect()
})