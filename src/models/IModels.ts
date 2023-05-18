import { GiftType,CurrencyType } from '@prisma/client'

export interface ICity{
    id?: number,
    name?: string,
    description?:string,
    index?:number
    startDate?: Date
    endDate?:Date

    giftGroups?:IGiftGroup[]
}

export interface IGiftGroup {
    name?:string,
    type?: GiftType,
    numMaxGifts?: number

    gifts:IGift[]
}

export interface IGift {
    id?:number,
    createdAt?: Date,
    updatedAt?: Date,
    memberName?: string,
    amount?:number,
    message?:string,
    giftGroupID?: number,
    isPrivate?:boolean,
    currency?:CurrencyType
}