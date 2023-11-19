import Joi from 'joi'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'

const EtapaPlugin = {
    name:'app/etapa',
    dependencies: ['prisma'],
    register: async function(server: Hapi.Server) {
        server.route([{
            method:'GET',
            path:'/etapa/{id}',
            handler:getEtapaHandler,
            options: {
                validate:{
                    params: Joi.object({
                        id: Joi.number(),
                    })
                }
            }
        },{
            method:'GET',
            path:'/etapas',
            handler:getAllEtapasHandler,
        }])
    }
}

export default EtapaPlugin

async function getEtapaHandler(request: Hapi.Request, h: Hapi.ResponseToolkit){
    const { prisma } = request.server.app
    const id = request.params.id

    try {
        const etapa = await prisma.etapa.findUnique({
            where: {
                id: id,
            },
            include:{
                giftGroups:{
                    include:{
                        gifts:true
                    }
                }
            }
        })

        if(!etapa)
            return h.response().code(404)
        else {
            return h.response(etapa).code(200)
        }
    } catch (e) {
        return Boom.badImplementation('Failed to get etapa')
    }
}
async function getAllEtapasHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    return await prisma.etapa.findMany({include:{giftGroups:{include:{
        gifts:true
    }}}})
}

