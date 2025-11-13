export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export interface Stat {
  title: string
  icon: string
  value: string | number
  variation?: number
}

export interface Sale {
  id: string
  date: string
  status: string
  email: string
  amount: number
}

export interface ChartData {
  date: string
  amount: number
}
