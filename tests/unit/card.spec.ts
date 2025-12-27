import { test } from '@japa/runner'
import { Card } from '#domain/entities/card'
import { CardId } from '#domain/value_objects/card_id.value_object'
import { Category, CategoryValueObject } from '#domain/value_objects/category.value_object'

test.group('Card Entity', () => {
  test('should create a valid Card', ({ assert }) => {
    const cardId = new CardId('card-123')
    const category = new CategoryValueObject(Category.FIRST)
    const reviewDate = new Date('2025-12-28')

    const card = new Card(
      cardId,
      'What is TypeScript?',
      'A typed superset of JavaScript',
      'programming',
      category,
      'user-1',
      reviewDate
    )

    assert.equal(card.id.value, 'card-123')
    assert.equal(card.question, 'What is TypeScript?')
    assert.equal(card.answer, 'A typed superset of JavaScript')
    assert.equal(card.tag, 'programming')
    assert.equal(card.category.value, Category.FIRST)
    assert.equal(card.userId, 'user-1')
    assert.deepEqual(card.nextReviewDate, reviewDate)
  })

  test('should create Card without tag', ({ assert }) => {
    const cardId = new CardId('card-456')
    const category = new CategoryValueObject(Category.SECOND)

    const card = new Card(cardId, 'Question', 'Answer', undefined, category, 'user-2')

    assert.isUndefined(card.tag)
  })

  test('should create Card with default review date', ({ assert }) => {
    const cardId = new CardId('card-789')
    const category = new CategoryValueObject(Category.FIRST)
    const beforeCreate = new Date()

    const card = new Card(cardId, 'Question', 'Answer', 'tag', category, 'user-3')

    const afterCreate = new Date()

    assert.isTrue(card.nextReviewDate >= beforeCreate)
    assert.isTrue(card.nextReviewDate <= afterCreate)
  })

  test('should convert Card to JSON correctly', ({ assert }) => {
    const cardId = new CardId('card-json')
    const category = new CategoryValueObject(Category.THIRD)
    const reviewDate = new Date('2025-12-30')

    const card = new Card(
      cardId,
      'Test Question',
      'Test Answer',
      'test-tag',
      category,
      'user-json',
      reviewDate
    )

    const json = card.toJSON()

    assert.deepEqual(json, {
      id: 'card-json',
      question: 'Test Question',
      answer: 'Test Answer',
      tag: 'test-tag',
      category: 'THIRD',
    })
  })

  test('should convert Card to JSON without tag', ({ assert }) => {
    const cardId = new CardId('card-no-tag')
    const category = new CategoryValueObject(Category.DONE)

    const card = new Card(cardId, 'Question', 'Answer', undefined, category, 'user-id')

    const json = card.toJSON()

    assert.isUndefined(json.tag)
  })
})
