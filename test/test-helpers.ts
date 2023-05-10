import { PrismaClient } from '@prisma/client'

export function setTestFlag(env:NodeJS.ProcessEnv){
    jest.resetModules();
    process.env = { ...env }
    process.env.NODE_ENV = 'test'
    process.env.TEST = 'true'
    process.env.DATABASE_URL = "mysql://root:prisma@127.0.0.1:3306/lunamiel-db-test"
}