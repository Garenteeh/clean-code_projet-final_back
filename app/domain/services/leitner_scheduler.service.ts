import { Card } from '../entities/card.js'
import { Category } from '../value_objects/category.value_object.js'

export class LeitnerSchedulerService {
  private readonly REVIEW_INTERVALS: Map<Category, number> = new Map([
    [Category.FIRST, 1],
    [Category.SECOND, 2],
    [Category.THIRD, 4],
    [Category.FOURTH, 8],
    [Category.FIFTH, 16],
    [Category.SIXTH, 32],
    [Category.SEVENTH, 64],
  ])

  shouldReviewCard(card: Card, reviewDate: Date): boolean {
    if (card.category.value === Category.DONE) {
      return false
    }

    if (card.category.value === Category.FIRST) {
      return true
    }

    if (!card.lastReviewedAt) {
      return true
    }

    const daysSinceLastReview = this.getDaysDifference(card.lastReviewedAt, reviewDate)

    const reviewInterval = this.REVIEW_INTERVALS.get(card.category.value) || 1

    return daysSinceLastReview >= reviewInterval
  }

  filterCardsForReview(cards: Card[], reviewDate: Date): Card[] {
    return cards.filter((card) => this.shouldReviewCard(card, reviewDate))
  }

  private getDaysDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
    const diffTime = end.getTime() - start.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }
}
