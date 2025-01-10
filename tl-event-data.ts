// create interface class and use reactive controllers

import { Moment } from "moment"

export interface TlEventData {
    title: string
    startDate: [year: number, month: number, day: number]
    endDate: [year: number, month: number, day: number]
}