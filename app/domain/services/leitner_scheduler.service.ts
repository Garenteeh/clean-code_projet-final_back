import { Card } from '#domain/entities/card'
import { Category } from '#domain/value_objects/category.value_object'

export class LeitnerSchedulerService {
  private readonly intervalsByCategory: Map<Category, number> = new Map([
    [Category.FIRST, 1],
    [Category.SECOND, 2],
    [Category.FOURTH, 8],
    [Category.FIFTH, 16],
    [Category.SIXTH, 32],
    [Category.SEVENTH, 64],
    [Category.DONE, 0],
  ])

  private readonly categories = [
    Category.FIRST,
    Category.SECOND,
    Category.THIRD,
    Category.FOURTH,
    Category.FIFTH,
    Category.SIXTH,
    Category.SEVENTH,
    Category.DONE,
  ]

  getNextCategory(currentCategory: Category, isValid: boolean): Category {
    if (isValid) {
      return this.promoteCategory(currentCategory)
    } else {
      return this.demoteCategory(currentCategory)
    }
  }

  private promoteCategory(currentCategory: Category): Category {
    const currentIndex = this.categories.indexOf(currentCategory)

    if (currentCategory === Category.DONE) {
      return Category.DONE
    }

    if (currentCategory === Category.SEVENTH) {
      return Category.DONE
    }

    if (currentIndex < this.categories.length - 1) {
      return this.categories[currentIndex + 1]
    }

    return Category.DONE
  }

  private demoteCategory(currentCategory: Category): Category {
    if (currentCategory === Category.DONE) {
      return Category.DONE
    }

    return Category.FIRST
  }

  calculateNextReviewDate(category: Category, fromDate: Date = new Date()): Date {
    const interval = this.intervalsByCategory.get(category) || 0
    const nextDate = new Date(fromDate)
    nextDate.setDate(nextDate.getDate() + interval)
    return nextDate
  }

  shouldBeProposedAt(card: Card, date: Date): boolean {
    if (card.category.value === Category.DONE) {
      return false
    }

    return card.nextReviewDate <= date
  }

  filterCardsForReview(cards: Card[], date: Date): Card[] {
    return cards.filter((card) => this.shouldBeProposedAt(card, date))
  }
}
