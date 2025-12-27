import { Card } from '#domain/entities/card'
import { CardRepositoryPort } from '#domain/ports/card_repository'

export class QuizService {
  constructor(private cardRepository: CardRepositoryPort) {}

  async getCardsForQuiz(userId: string, date?: Date): Promise<Card[]> {
    const quizDate = date || new Date()
    return await this.cardRepository.findCardsForQuiz(userId, quizDate)
  }
}
