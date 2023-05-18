import Joi from 'joi'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'

const GiftGroupPlugin = {
    name:'app/giftGroup',
    dependencies:['prisma'],
    register: async function (server: Hapi.Server){
        server.route([{
            method:'GET',
            path:'/giftGroups',
            handler: getAllGroupsHandler
        },{
            method:'GET',
            path:'/giftGroups/{id}',
            handler: getGroupByIdHandler,
            options:{
                validate:{
                    params: Joi.object({
                        id:Joi.number()
                    })
                }
            }
        }])
    }
}

export default GiftGroupPlugin

async function getAllGroupsHandler(request: Hapi.Request, h: Hapi.ResponseToolkit){
    const { prisma } = request.server.app
    return await prisma.giftGroup.findMany({
        include:{
            gifts:true,
            city:true
        }
    })

}

async function getGroupByIdHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    const { id } = request.params
    
    try{

        const gg = await prisma.giftGroup.findUnique({
            where:{
                id:id
            },include:{
                gifts:true,
                city:true
            }
        })
        if(!gg)
            return h.response().code(404)
        else
            return h.response(gg).code(200)

    } catch (e){
        return Boom.badImplementation('Failed to get gift group by id')
    }
}