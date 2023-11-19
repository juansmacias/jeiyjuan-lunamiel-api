import _ from 'lodash'
require('dotenv').config({override:true})
import { PrismaClient,GiftType,CurrencyType } from '@prisma/client'
import { ICity,IGift,IEtapa } from '../models/IModels'

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
    name:'Salt Lake City, UT',
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

const etapas:IEtapa[] = [{
    name:'Etapa#1-Pañales',
    description:'En la etapa # 1 se necesitan 600 pañales para esta etapa. Preferiblemente de la marca Huggies o Winny.',
    index:1,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa1.jpeg',
    type:GiftType.DAIPERS
},{
    name:'Etapa#2-Pañales',
    description:'En la etapa # 2 se necesitan 600 pañales para esta etapa. Preferiblemente de la marca Huggies o Winny.',
    index:2,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa2.jpeg',
    type:GiftType.DAIPERS
},{
    name:'Etapa#3-Pañales',
    description:'En la etapa # 3 se necesitan 1500 pañales para esta etapa. Preferiblemente de la marca Huggies o Winny.',
    index:3,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa3.jpeg',
    type:GiftType.DAIPERS
},{
    name:'Etapa#4-Pañales',
    description:'En la etapa # 4 se necesitan 1500 pañales para esta etapa. Preferiblemente de la marca Huggies o Winny.',
    index:4,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa4.jpeg',
    type:GiftType.DAIPERS
},{
    name:'Bodies',
    description:'Se van a usar bastantes Bodies. Pueden ser de cualquier estilo. Mejor si images cheveres o frases chistosas.',
    index:5,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa5.jpeg',
    type:GiftType.CLOTHES
},{
    name:'Ropa para 3 meses',
    description:'Ropa hay de todo estilo y de color. Entre más colorido mejor. Jajajaja.',
    index:6,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa5.jpeg',
    type:GiftType.CLOTHES
},{
    name:'Ropa para 6 meses',
    description:'Ropa hay de todo estilo y de color. Entre más colorido mejor. Jajajaja. ',
    index:7,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa6.jpeg',
    type:GiftType.CLOTHES
},{
    name:'Ropa para 12 meses',
    description:'Ropa hay de todo estilo y de color. Entre más colorido mejor. Jajajaja.',
    index:8,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa8.jpeg',
    type:GiftType.CLOTHES
},{
    name:'Juguetes #1 Recien Nacido',
    description:'Juegos para su motricidad serian buenos',
    index:9,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa9.jpeg',
    type:GiftType.TOYS
},{
    name:'Juguetes #2 para 12 meses',
    description:'En la etapa # 1 se necesitan 10 juguetes para esta etapa.',
    index:10,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa10.jpeg',
    type:GiftType.TOYS,
},{
    name:'Regalos para la nueva madre',
    description: 'La nueva madre necesita de todo. Desde ropa interior hasta cremas para el cuerpo. Todo es bienvenido.',
    index:11,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa11.jpeg',
    type:GiftType.MOTHER
},{
    name:'Regalos para el nuevo padre',
    description: 'El nuevo padre necesita de todo. Desde sujetadores, camaras, pañaleras. Todo es bienvenido.',
    index:12,
    photoUrl:'https://storage.googleapis.com/fotos-luna-de-miel-app/etapa12.jpeg',
    type:GiftType.FATHER
},{
    name:'Accesorios para el nuevo bebe',
    description: 'El nuevo bebe necesita de todo. Desde chupos, baberos, teteros. Todo es bienvenido.',
    index:13,
    type:GiftType.ACCESSORIES,
}]

export async function destroyAllPromise() {
    // if(process.env.TEST === 'true'){
  
      const delete1 = prisma.gift.deleteMany({})
      const delete2 = prisma.giftGroup.deleteMany({})
      const delete3 = prisma.city.deleteMany({})
      const delete4 = prisma.etapa.deleteMany({})
  
      return prisma.$transaction([delete1,delete2,delete3,delete4])
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

async function createEtapaGift(memberName:string,itemName:string,urlGift:string, giftGroupName:string,isPrivate:boolean) {
    await prisma.gift.create({
        data:{
            memberName:memberName,
            itemName:itemName,
            urlGift:urlGift,
            isPrivate:isPrivate,
            giftGroup:{
                connect:{
                    name:giftGroupName
                }
            }
        }
    })
}

async function createCities() {
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
}

async function createEtapaGifts() {
    for (const etapa of etapas){
        await createEtapa(etapa)
    }
}

async function createEtapa(etapa:IEtapa) {
    const r = await prisma.etapa.create({
        data:{
            name:etapa.name!,
            description:etapa.description!,
            index:etapa.index!,
            photoUrl:etapa.photoUrl!,
            giftGroups:{
                create:{
                    name:etapa.name!,
                    type:etapa.type!,
                    numMaxGifts:15,
                }
            }
        }
    })
}
// A `main` function so that we can use async/await
async function main() {
    await destroyAllPromise()
    await createEtapaGifts()
  
    await createGift('FAM Macias & Morillo',100,CurrencyType.COP,'Etapa#1-Pañales',false)
    await createGift('FAM Macias & Morillo',2,CurrencyType.COP,'Ropa para 12 meses',true)

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