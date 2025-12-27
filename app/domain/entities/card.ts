import { CardId } from '../value_objects/card_id.value_object.js'
import { CategoryValueObject } from '../value_objects/category.value_object.js'

export class Card {
  constructor(
    public readonly id: CardId,
    public readonly question: string,
    public readonly answer: string,
    public readonly tag: string | undefined,
    public readonly category: CategoryValueObject,
    public readonly userId: string,
    public readonly lastReviewedAt: Date | undefined = undefined
  ) {}

  toJSON() {
    return {
      id: this.id.toString(),
      question: this.question,
      answer: this.answer,
      tag: this.tag,
      category: this.category.toString(),
    }
  }
}
