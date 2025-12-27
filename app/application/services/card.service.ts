import { Card } from '#domain/entities/card'
import { CardId } from '#domain/value_objects/card_id.value_object'
import { CategoryValueObject, Category } from '#domain/value_objects/category.value_object'
import { CardRepositoryPort } from '#domain/ports/card_repository'
import { LeitnerSchedulerService } from '#domain/services/leitner_scheduler.service'

export class CardService {
  private leitnerScheduler: LeitnerSchedulerService

  constructor(private cardRepository: CardRepositoryPort) {
    this.leitnerScheduler = new LeitnerSchedulerService()
  }

  async createCard(
    question: string,
    answer: string,
    tag: string | undefined,
    userId: string
  ): Promise<Card> {
    const cardId = new CardId(crypto.randomUUID())
    const category = new CategoryValueObject(Category.FIRST)

    const nextReviewDate = this.leitnerScheduler.calculateNextReviewDate(Category.FIRST)

    const card = new Card(cardId, question, answer, tag, category, userId, nextReviewDate)
    return await this.cardRepository.save(card)
  }

  async getCardsByTags(userId: string, tags?: string[]): Promise<Card[]> {
    return await this.cardRepository.findAll(userId, tags)
  }

  async getCardById(cardId: string, userId: string): Promise<Card | null> {
    const id = new CardId(cardId)
    return await this.cardRepository.findById(id, userId)
  }

  async answerCard(cardId: string, isValid: boolean, userId: string): Promise<Card> {
    const id = new CardId(cardId)
    const card = await this.cardRepository.findById(id, userId)

    if (!card) {
      throw new Error('Card not found')
    }

    const newCategory = this.leitnerScheduler.getNextCategory(card.category.value, isValid)

    const nextReviewDate = this.leitnerScheduler.calculateNextReviewDate(newCategory)

    const updatedCard = new Card(
      card.id,
      card.question,
      card.answer,
      card.tag,
      new CategoryValueObject(newCategory),
      card.userId,
      nextReviewDate
    )

    return await this.cardRepository.update(updatedCard)
  }
}
