import prisma from '@/lib/prisma'
import { userRole } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const role = url.searchParams.get('role') as userRole | null

    let userCount

    if (role) {
      userCount = await prisma.user.count({
        where: {
          role: role,
        },
      })
    } else {
      userCount = await prisma.user.count()
    }

    return new Response(
      JSON.stringify({ count: userCount }),
      { status: 200 }
    )
  } catch (err) {
    console.error('Error fetching user count:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user count' }),
      { status: 500 }
    )
  }
}
