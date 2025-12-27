import { test } from '@japa/runner'
import { LeitnerSchedulerService } from '#domain/services/leitner_scheduler.service'
import { Category, CategoryValueObject } from '#domain/value_objects/category.value_object'
import { Card } from '#domain/entities/card'
import { CardId } from '#domain/value_objects/card_id.value_object'

test.group('LeitnerSchedulerService - getNextCategory - Promotion', () => {
  test('should promote from FIRST to SECOND on valid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.FIRST, true)
    assert.equal(nextCategory, Category.SECOND)
  })

  test('should promote from SECOND to THIRD on valid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.SECOND, true)
    assert.equal(nextCategory, Category.THIRD)
  })

  test('should promote from THIRD to FOURTH on valid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.THIRD, true)
    assert.equal(nextCategory, Category.FOURTH)
  })

  test('should promote from FOURTH to FIFTH on valid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.FOURTH, true)
    assert.equal(nextCategory, Category.FIFTH)
  })

  test('should promote from FIFTH to SIXTH on valid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.FIFTH, true)
    assert.equal(nextCategory, Category.SIXTH)
  })

  test('should promote from SIXTH to SEVENTH on valid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.SIXTH, true)
    assert.equal(nextCategory, Category.SEVENTH)
  })

  test('should promote from SEVENTH to DONE on valid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.SEVENTH, true)
    assert.equal(nextCategory, Category.DONE)
  })

  test('should keep DONE as DONE on valid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.DONE, true)
    assert.equal(nextCategory, Category.DONE)
  })
})

test.group('LeitnerSchedulerService - getNextCategory - Demotion', () => {
  test('should demote from SECOND to FIRST on invalid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.SECOND, false)
    assert.equal(nextCategory, Category.FIRST)
  })

  test('should demote from THIRD to FIRST on invalid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.THIRD, false)
    assert.equal(nextCategory, Category.FIRST)
  })

  test('should demote from SEVENTH to FIRST on invalid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.SEVENTH, false)
    assert.equal(nextCategory, Category.FIRST)
  })

  test('should keep DONE as DONE on invalid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.DONE, false)
    assert.equal(nextCategory, Category.DONE)
  })

  test('should keep FIRST as FIRST on invalid answer', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const nextCategory = service.getNextCategory(Category.FIRST, false)
    assert.equal(nextCategory, Category.FIRST)
  })
})

test.group('LeitnerSchedulerService - calculateNextReviewDate', () => {
  test('should calculate next review date for FIRST category (1 day)', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const fromDate = new Date('2025-12-27T12:00:00')
    const nextDate = service.calculateNextReviewDate(Category.FIRST, fromDate)

    assert.equal(nextDate.getDate(), 28)
    assert.equal(nextDate.getMonth(), 11) // December (0-indexed)
    assert.equal(nextDate.getFullYear(), 2025)
  })

  test('should calculate next review date for SECOND category (2 days)', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const fromDate = new Date('2025-12-27T12:00:00')
    const nextDate = service.calculateNextReviewDate(Category.SECOND, fromDate)

    assert.equal(nextDate.getDate(), 29)
    assert.equal(nextDate.getMonth(), 11)
  })

  test('should calculate next review date for THIRD category (4 days)', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const fromDate = new Date('2025-12-27T12:00:00')
    const nextDate = service.calculateNextReviewDate(Category.THIRD, fromDate)

    assert.equal(nextDate.getDate(), 31)
    assert.equal(nextDate.getMonth(), 11)
  })

  test('should calculate next review date for FOURTH category (8 days)', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const fromDate = new Date('2025-12-27T12:00:00')
    const nextDate = service.calculateNextReviewDate(Category.FOURTH, fromDate)

    assert.equal(nextDate.getDate(), 4)
    assert.equal(nextDate.getMonth(), 0) // January
    assert.equal(nextDate.getFullYear(), 2026)
  })

  test('should calculate next review date for FIFTH category (16 days)', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const fromDate = new Date('2025-12-27T12:00:00')
    const nextDate = service.calculateNextReviewDate(Category.FIFTH, fromDate)

    assert.equal(nextDate.getDate(), 12)
    assert.equal(nextDate.getMonth(), 0) // January 2026
  })

  test('should calculate next review date for SIXTH category (32 days)', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const fromDate = new Date('2025-12-27T12:00:00')
    const nextDate = service.calculateNextReviewDate(Category.SIXTH, fromDate)

    assert.equal(nextDate.getDate(), 28)
    assert.equal(nextDate.getMonth(), 0) // January 2026
  })

  test('should calculate next review date for SEVENTH category (64 days)', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const fromDate = new Date('2025-12-27T12:00:00')
    const nextDate = service.calculateNextReviewDate(Category.SEVENTH, fromDate)

    assert.equal(nextDate.getDate(), 1)
    assert.equal(nextDate.getMonth(), 2) // March 2026
  })

  test('should return same date for DONE category (0 days)', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const fromDate = new Date('2025-12-27T12:00:00')
    const nextDate = service.calculateNextReviewDate(Category.DONE, fromDate)

    assert.equal(nextDate.getDate(), 27)
    assert.equal(nextDate.getMonth(), 11)
  })

  test('should use current date when fromDate is not provided', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const beforeCall = new Date()
    const nextDate = service.calculateNextReviewDate(Category.FIRST)
    const afterCall = new Date()

    const expectedMin = new Date(beforeCall)
    expectedMin.setDate(expectedMin.getDate() + 1)

    const expectedMax = new Date(afterCall)
    expectedMax.setDate(expectedMax.getDate() + 1)

    assert.isTrue(nextDate >= expectedMin)
    assert.isTrue(nextDate <= expectedMax)
  })
})

test.group('LeitnerSchedulerService - shouldBeProposedAt', () => {
  test('should return true when card review date is before current date', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const card = new Card(
      new CardId('card-1'),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.FIRST),
      'user-1',
      new Date('2025-12-20')
    )

    const currentDate = new Date('2025-12-27')
    assert.isTrue(service.shouldBeProposedAt(card, currentDate))
  })

  test('should return true when card review date equals current date', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const card = new Card(
      new CardId('card-2'),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.SECOND),
      'user-1',
      new Date('2025-12-27T12:00:00')
    )

    const currentDate = new Date('2025-12-27T12:00:00')
    assert.isTrue(service.shouldBeProposedAt(card, currentDate))
  })

  test('should return false when card review date is after current date', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const card = new Card(
      new CardId('card-3'),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.THIRD),
      'user-1',
      new Date('2025-12-30')
    )

    const currentDate = new Date('2025-12-27')
    assert.isFalse(service.shouldBeProposedAt(card, currentDate))
  })

  test('should return false when card category is DONE', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const card = new Card(
      new CardId('card-4'),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.DONE),
      'user-1',
      new Date('2025-12-20')
    )

    const currentDate = new Date('2025-12-27')
    assert.isFalse(service.shouldBeProposedAt(card, currentDate))
  })
})

test.group('LeitnerSchedulerService - filterCardsForReview', () => {
  test('should filter cards that are due for review', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const cards = [
      new Card(
        new CardId('card-1'),
        'Q1',
        'A1',
        undefined,
        new CategoryValueObject(Category.FIRST),
        'user-1',
        new Date('2025-12-20')
      ),
      new Card(
        new CardId('card-2'),
        'Q2',
        'A2',
        undefined,
        new CategoryValueObject(Category.SECOND),
        'user-1',
        new Date('2025-12-30')
      ),
      new Card(
        new CardId('card-3'),
        'Q3',
        'A3',
        undefined,
        new CategoryValueObject(Category.THIRD),
        'user-1',
        new Date('2025-12-27')
      ),
    ]

    const currentDate = new Date('2025-12-27')
    const filtered = service.filterCardsForReview(cards, currentDate)

    assert.lengthOf(filtered, 2)
    assert.equal(filtered[0].id.value, 'card-1')
    assert.equal(filtered[1].id.value, 'card-3')
  })

  test('should exclude DONE cards from review', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const cards = [
      new Card(
        new CardId('card-1'),
        'Q1',
        'A1',
        undefined,
        new CategoryValueObject(Category.DONE),
        'user-1',
        new Date('2025-12-20')
      ),
      new Card(
        new CardId('card-2'),
        'Q2',
        'A2',
        undefined,
        new CategoryValueObject(Category.FIRST),
        'user-1',
        new Date('2025-12-25')
      ),
    ]

    const currentDate = new Date('2025-12-27')
    const filtered = service.filterCardsForReview(cards, currentDate)

    assert.lengthOf(filtered, 1)
    assert.equal(filtered[0].id.value, 'card-2')
  })

  test('should return empty array when no cards are due', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const cards = [
      new Card(
        new CardId('card-1'),
        'Q1',
        'A1',
        undefined,
        new CategoryValueObject(Category.FIRST),
        'user-1',
        new Date('2025-12-30')
      ),
    ]

    const currentDate = new Date('2025-12-27')
    const filtered = service.filterCardsForReview(cards, currentDate)

    assert.lengthOf(filtered, 0)
  })

  test('should return empty array when input is empty', ({ assert }) => {
    const service = new LeitnerSchedulerService()
    const cards: Card[] = []

    const currentDate = new Date('2025-12-27')
    const filtered = service.filterCardsForReview(cards, currentDate)

    assert.lengthOf(filtered, 0)
  })
})
