import { CardRepositoryPort } from '#domain/ports/card_repository'
import { Card } from '#domain/entities/card'
import { CardId } from '#domain/value_objects/card_id.value_object'
import { Category } from '#domain/value_objects/category.value_object'

export default class CardRepository implements CardRepositoryPort {
  private cards: Map<string, Card> = new Map()

  async findAll(userId: string, tags?: string[]): Promise<Card[]> {
    const userCards = Array.from(this.cards.values()).filter((card) => card.userId === userId)

    if (!tags || tags.length === 0) {
      return userCards
    }

    return userCards.filter((card) => card.tag && tags.includes(card.tag))
  }

  async findById(cardId: CardId, userId: string): Promise<Card | null> {
    const card = this.cards.get(cardId.toString())
    if (!card || card.userId !== userId) {
      return null
    }
    return card
  }

  async save(card: Card): Promise<Card> {
    this.cards.set(card.id.toString(), card)
    return card
  }

  async findCardsForQuiz(userId: string, date: Date): Promise<Card[]> {
    const targetDate = new Date(date)
    targetDate.setHours(23, 59, 59, 999)

    return Array.from(this.cards.values()).filter((card) => {
      if (card.userId !== userId) return false

      if (card.category.value === Category.DONE) return false

      return card.nextReviewDate <= targetDate
    })
  }

  async update(card: Card): Promise<Card> {
    this.cards.set(card.id.toString(), card)
    return card
  }
}
