
import { PrismaClient } from '@prisma/client'

export async function destroyAllPromise(prisma:PrismaClient) {
  
    const delete1 = prisma.gift.deleteMany({})
    const delete2 = prisma.giftGroup.deleteMany({})
    const delete3 = prisma.city.deleteMany({})

    return prisma.$transaction([delete1,delete2,delete3])

}