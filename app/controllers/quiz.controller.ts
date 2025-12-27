import { QuizService } from '#application/services/quiz.service'
import CardRepository from '#infrastructure/adapters/repositories/card_repository'
import { CardService } from '#application/services/card.service'

const cardRepository = new CardRepository()
const quizService = new QuizService(cardRepository)
const cardService = new CardService(cardRepository)

type HttpContext = {
  request: {
    user?: {
      userId: string
      username?: string
    }
    qs: () => {
      date?: string
    }
    only: (keys: string[]) => Record<string, any>
  }
  response: {
    unauthorized: (data: any) => any
    ok: (data: any) => any
    badRequest: (data: any) => any
    notFound: (data: any) => any
    noContent: () => any
    internalServerError: (data: any) => any
  }
  params: Record<string, any>
}

export default class QuizController {
  async getQuizCards({ request, response }: HttpContext) {
    const userId = request.user?.userId
    if (!userId) {
      return response.unauthorized({ error: 'Non authentifié' })
    }

    const dateParam = request.qs().date
    let date: Date | undefined

    if (dateParam) {
      date = new Date(dateParam)
      if (Number.isNaN(date.getTime())) {
        return response.badRequest({
          error: 'Format de date invalide. Utilisez le format YYYY-MM-DD',
        })
      }
    }

    try {
      const cards = await quizService.getCardsForQuiz(userId, date)
      return response.ok(cards.map((card) => card.toJSON()))
    } catch (error) {
      return response.internalServerError({
        error: 'Erreur lors de la récupération des cards du quiz',
      })
    }
  }

  async answer({ params, request, response }: HttpContext) {
    const userId = request.user?.userId
    if (!userId) {
      return response.unauthorized({ error: 'Non authentifié' })
    }

    const { cardId } = params
    const { isValid } = request.only(['isValid'])

    if (typeof isValid !== 'boolean') {
      return response.badRequest({
        error: 'isValid doit être un booléen',
      })
    }

    try {
      await cardService.answerCard(cardId, isValid, userId)
      return response.noContent()
    } catch (error) {
      if (error instanceof Error && error.message === 'Card not found') {
        return response.notFound({ error: 'Card not found' })
      }
      return response.badRequest({
        error: 'Erreur lors de la mise à jour de la card',
      })
    }
  }
}
