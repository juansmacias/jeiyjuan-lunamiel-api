import _ from 'lodash'
require('dotenv').config({override:true})
import { PrismaClient,GiftType,CurrencyType } from '@prisma/client'
import { ICity,IGift } from '../models/IModels'

const prisma = new PrismaClient()
const cities:ICity[] = [{
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
    index:7,
    startDate:new Date(2023,6,22,7,0),
    endDate:new Date(2023,6,23,7,0)
},{
    name:'Austin, TX',
    description:'Desc Austin',
    index:8,
    startDate:new Date(2023,6,24,7,0),
    endDate:new Date(2023,6,29,10,40)
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
    await destroyAllPromise()

    const r = await prisma.city.create({
        data:{
            name:'Bogota, CO',
            description:'Aca arranca nuestra aventura. Con toda la energia nos vamos!',
            index:1,
            photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/bogota.jpeg',
            startDate:new Date(2023,5,8,9,19),
            endDate:new Date(2023,6,8,23,12,0)
        }
    })
    for( const city of cities){
        console.log('city: ',city)
        if(city.name==='Houston, TX'){
            const r = await prisma.city.create({
                data:{
                    name:city.name!,
                    description:city.description!,
                    index:city.index!,
                    startDate:city.startDate!,
                    endDate:city.endDate!,
                    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/genericCityPic.jpg',
                    giftGroups:{
                        createMany:{
                            data:[{
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
        } else if (city.name==='Austin, TX'){
            const r = await prisma.city.create({
                data:{
                    name:city.name!,
                    description:city.description!,
                    index:city.index!,
                    startDate:city.startDate!,
                    endDate:city.endDate!,
                    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/genericCityPic.jpg',
                    giftGroups:{
                        createMany:{
                            data:[{
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
        } else {
            const r = await prisma.city.create({
            data:{
                name:city.name!,
                description:city.description!,
                index:city.index!,
                startDate:city.startDate!,
                endDate:city.endDate!,
                photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/genericCityPic.jpg',
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
        
    }


    const r2 = await prisma.city.create({
        data:{
            name:'Regreso a Casa',
            description:'Colorin Colorado este viaje se ha acabado!',
            index:9,
            photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/CasitaBlanca.png',
            startDate:new Date(2023,6,29,10,40),
            endDate:new Date(2023,6,30,1,10)
        }
    })
  
    await createGift('FAM Macias & Morillo',100000,CurrencyType.COP,'Cancun-Hospedaje',false)
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