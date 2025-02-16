import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

type UserWithCountResponse = {
  users: {
    id: number
    name: string
    email: string
    birthday: Date
    gender: string
    school: string
    role: string
    createdAt: Date
    updatedAt: Date
  }[]
  count: number
}

const getAllUsersWithCount = async (): Promise<UserWithCountResponse> => {
  // Fetch all users, including related Account (if needed)
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc', // Optional: sort by creation date (newest first)
    },
  })

  // Get the total count of users
  const count = await prisma.user.count()

  return { users, count }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get users and count
    const { users, count } = await getAllUsersWithCount()

    // Return the users and count as a response
    res.status(200).json({ users, count })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
