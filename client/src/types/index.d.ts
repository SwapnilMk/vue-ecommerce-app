export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  brand?: string
  images: string[]
  description?: string
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

export interface Order {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  orderItems: {
    product: {
      id: string
      name: string
      price: number
      images: string[]
    }
    quantity: number
    price: number
    id: string
  }[]
  totalAmount: number
  orderStatus: string
  createdAt: string
  updatedAt?: string
  shippingAddress: {
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: string
}
