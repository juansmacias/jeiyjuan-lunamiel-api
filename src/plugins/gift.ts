import Joi from 'joi'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'

import { CurrencyType } from '@prisma/client'

const giftInputValidator = Joi.object({
    memberName:Joi.string().required(),
    amount:Joi.number().required(),
    giftGroupName: Joi.string().required(),
    isPrivate:Joi.boolean().required(),
    currency:Joi.string().valid(...Object.values(CurrencyType))
})

const GiftPlugin = {
    name:'app/gift',
    dependencies: ['prisma'],
    register: async function(server: Hapi.Server) {
        server.route([{
            method:'GET',
            path:'/gifts',
            handler:getAllGiftsHandler,
        },{
            method:'GET',
            path:'/gifts/{id}',
            handler:getGiftHandler,
            options: {
                validate:{
                    params: Joi.object({
                        id: Joi.number(),
                    })
                }
            }
        },{
            method:'GET',
            path:'/gifts/member/{memberName}',
            handler:getGiftsByMemberHandler,
            options: {
                validate:{
                    params: Joi.object({
                        memberName: Joi.string(),
                    })
                }
            }
        },{
            method:'POST',
            path:'/gifts',
            handler:createGiftHandler,
            options:{
                validate:{
                    payload:giftInputValidator,
                    failAction: (request, h, err) => {
                        throw err
                      },
                }
            }
        }])
    }
}

export default GiftPlugin

interface IGiftInput {
    memberName:string,
    amount:number,
    giftGroupName:string,
    isPrivate:boolean,
    currency:string
}

async function getAllGiftsHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    return await prisma.gift.findMany({include:{giftGroup:true}})
}

async function getGiftHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    const id = request.params.id

    try {
        const gift = await prisma.gift.findUnique({
            where: {
                id: id,
            },
            include:{
                giftGroup:true
            }
        })

        if(!gift)
            return h.response().code(404)
        else {
            return h.response(gift).code(200)
        }
    } catch (e) {
        return Boom.badImplementation('Failed to get gift')
    }
}

async function getGiftsByMemberHandler(request: Hapi.Request, h: Hapi.ResponseToolkit){
    const { prisma } = request.server.app
    const memberName = request.params.memberName

    try {
        const gifts = await prisma.gift.findMany({
            where:{
                memberName:memberName
            },include:{
                giftGroup:true
            }
        })

            return h.response(gifts).code(200)
    } catch (e) {
        return Boom.badImplementation('Failed to get gift')
    }
}

async function createGiftHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    const payload = request.payload as IGiftInput

    try {
        const gift = await prisma.gift.create({
            data:{
                memberName: payload.memberName,
                amount:payload.amount,
                isPrivate:payload.isPrivate,
                giftGroup:{connect:{
                    name:payload.giftGroupName
                }},
                currency:getCurrencyType(payload.currency)
            }
        })

        return h.response(gift).code(200)

    } catch (e) {
        return Boom.badImplementation('Failed to create gift')
    }
}

function getCurrencyType(strCurrency:string):CurrencyType{
    switch(strCurrency){
        case "USD":
            return CurrencyType.USD
        case "COP":
            return CurrencyType.COP
    }

    return CurrencyType.COP
}
