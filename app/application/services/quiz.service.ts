import { Card } from '#domain/entities/card'
import { CardRepositoryPort } from '#domain/ports/card_repository'
import { LeitnerSchedulerService } from '#domain/services/leitner_scheduler.service'
import { quizDailyLimitService } from '#domain/services/quiz_daily_limit.service'

export class QuizService {
  private leitnerScheduler: LeitnerSchedulerService

  constructor(private cardRepository: CardRepositoryPort) {
    this.leitnerScheduler = new LeitnerSchedulerService()
  }

  async getCardsForQuiz(userId: string, date?: Date): Promise<Card[]> {
    const quizDate = date || new Date()

    if (quizDailyLimitService.hasQuizToday(userId, quizDate)) {
      throw new Error("Vous avez déjà fait un questionnaire aujourd'hui")
    }

    const allUserCards = await this.cardRepository.findCardsForQuiz(userId, quizDate)

    if (allUserCards.length === 0) {
      return []
    }

    const filteredCards = this.leitnerScheduler.filterCardsForReview(allUserCards, quizDate)

    if (filteredCards.length > 0) {
      quizDailyLimitService.recordQuiz(userId, quizDate)
    }

    return filteredCards
  }
}
