import { Card } from '../entities/card.js'
import { CardId } from '../value_objects/card_id.value_object.js'

export abstract class CardRepositoryPort {
  abstract findAll(userId: string, tags?: string[]): Promise<Card[]>
  abstract findById(cardId: CardId, userId: string): Promise<Card | null>
  abstract save(card: Card): Promise<Card>
  abstract findCardsForQuiz(userId: string, date: Date): Promise<Card[]>
  abstract update(card: Card): Promise<Card>
}
