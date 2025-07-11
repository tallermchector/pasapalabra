import { prisma } from '@/lib/prisma'
import { Game } from '@/components/game'
import type { Rosco } from '@/types'

async function getRoscos(): Promise<Rosco[]> {
  try {
    const roscos = await prisma.rosco.findMany({
      where: {
        isActive: true,
      },
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return roscos as Rosco[]
  } catch (error) {
    console.error('Error fetching roscos:', error)
    return []
  }
}

export default async function HomePage() {
  const roscos = await getRoscos()

  return <Game roscos={roscos} />
}