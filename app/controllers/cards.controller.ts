import { CardService } from '#application/services/card.service'
import CardRepository from '#infrastructure/adapters/repositories/card_repository'

const cardRepository = new CardRepository()
const cardService = new CardService(cardRepository)

type HttpContext = {
  request: {
    user?: {
      userId: string
      username?: string
    }
    qs: () => {
      tags?: string | string[]
    }
    only: (keys: string[]) => Record<string, any>
  }
  response: {
    unauthorized: (data: any) => any
    ok: (data: any) => any
    badRequest: (data: any) => any
    created: (data: any) => any
    internalServerError: (data: any) => any
  }
}

export default class CardsController {
  async index({ request, response }: HttpContext) {
    const userId = request.user?.userId
    if (!userId) {
      return response.unauthorized({ error: 'Non authentifié' })
    }

    const tagsParam = request.qs().tags
    const tags = tagsParam
      ? Array.isArray(tagsParam)
        ? tagsParam
        : tagsParam.split(',')
      : undefined

    try {
      const cards = await cardService.getCardsByTags(userId, tags)
      return response.ok(cards.map((card) => card.toJSON()))
    } catch (error) {
      return response.internalServerError({
        error: 'Erreur lors de la récupération des cards',
      })
    }
  }

  async store({ request, response }: HttpContext) {
    const userId = request.user?.userId
    if (!userId) {
      return response.unauthorized({ error: 'Non authentifié' })
    }

    const { question, answer, tag } = request.only(['question', 'answer', 'tag'])

    if (!question || !answer) {
      return response.badRequest({
        error: 'question et answer sont requis',
      })
    }

    try {
      const card = await cardService.createCard(question, answer, tag, userId)
      return response.created(card.toJSON())
    } catch (error) {
      return response.internalServerError({
        error: 'Erreur lors de la création de la card',
      })
    }
  }
}
