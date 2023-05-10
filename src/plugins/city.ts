import Joi from 'joi'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'

const CityPlugin = {
    name:'app/city',
    dependencies: ['prisma'],
    register: async function(server: Hapi.Server) {
        server.route([{
            method:'GET',
            path:'/cities/{id}',
            handler:getCityHandler,
            options: {
                validate:{
                    params: Joi.object({
                        id: Joi.number(),
                    })
                }
            }
        },{
            method:'GET',
            path:'/cities',
            handler:getAllCityHandler,
        }])
    }
}

export default CityPlugin

async function getCityHandler(request: Hapi.Request, h: Hapi.ResponseToolkit){
    const { prisma } = request.server.app
    const id = request.params.id

    try {
        const city = await prisma.city.findUnique({
            where: {
                id: id,
            },
            include:{
                giftGroups:true
            }
        })

        if(!city)
            return h.response().code(404)
        else {
            return h.response(city).code(200)
        }
    } catch (e) {
        return Boom.badImplementation('Failed to get city')
    }
}
async function getAllCityHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    return await prisma.city.findMany({include:{giftGroups:true}})
}