import { test } from '@japa/runner'
import { CardService } from '#application/services/card.service'
import { Card } from '#domain/entities/card'
import { CardId } from '#domain/value_objects/card_id.value_object'
import { CategoryValueObject, Category } from '#domain/value_objects/category.value_object'
import { CardRepositoryPort } from '#domain/ports/card_repository'

class MockCardRepository implements CardRepositoryPort {
  private cards: Map<string, Card> = new Map()

  async findAll(_userId: string, _tags?: string[]): Promise<Card[]> {
    return Array.from(this.cards.values())
  }

  async findById(cardId: CardId, _userId: string): Promise<Card | null> {
    return this.cards.get(cardId.toString()) || null
  }

  async save(card: Card): Promise<Card> {
    this.cards.set(card.id.toString(), card)
    return card
  }

  async findCardsForQuiz(_userId: string, _date: Date): Promise<Card[]> {
    return Array.from(this.cards.values())
  }

  async update(card: Card): Promise<Card> {
    this.cards.set(card.id.toString(), card)
    return card
  }

  getCard(cardId: string): Card | undefined {
    return this.cards.get(cardId)
  }

  reset(): void {
    this.cards.clear()
  }
}

test.group('CardService - Leitner System Tests', (group) => {
  let cardService: CardService
  let mockRepository: MockCardRepository
  const userId = 'user_123'

  group.each.setup(() => {
    mockRepository = new MockCardRepository()
    cardService = new CardService(mockRepository)
  })

  group.each.teardown(() => {
    mockRepository.reset()
  })

  test('should demote card to FIRST category when answer is incorrect', async ({ assert }) => {
    const cardId = new CardId('card_123')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.THIRD),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_123', false, userId)

    assert.equal(updatedCard.category.value, Category.FIRST)
  })

  test('should demote card from SEVENTH to FIRST when answer is incorrect', async ({ assert }) => {
    const cardId = new CardId('card_456')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.SEVENTH),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_456', false, userId)

    assert.equal(updatedCard.category.value, Category.FIRST)
  })

  test('should demote card from SECOND to FIRST when answer is incorrect', async ({ assert }) => {
    const cardId = new CardId('card_789')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.SECOND),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_789', false, userId)

    assert.equal(updatedCard.category.value, Category.FIRST)
  })

  test('should promote card from FIRST to SECOND when answer is correct', async ({ assert }) => {
    const cardId = new CardId('card_111')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_111', true, userId)

    assert.equal(updatedCard.category.value, Category.SECOND)
  })

  test('should promote card from SECOND to THIRD when answer is correct', async ({ assert }) => {
    const cardId = new CardId('card_222')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.SECOND),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_222', true, userId)

    assert.equal(updatedCard.category.value, Category.THIRD)
  })

  test('should promote card from THIRD to FOURTH when answer is correct', async ({ assert }) => {
    const cardId = new CardId('card_333')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.THIRD),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_333', true, userId)

    assert.equal(updatedCard.category.value, Category.FOURTH)
  })

  test('should promote card from FOURTH to FIFTH when answer is correct', async ({ assert }) => {
    const cardId = new CardId('card_444')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.FOURTH),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_444', true, userId)

    assert.equal(updatedCard.category.value, Category.FIFTH)
  })

  test('should promote card from FIFTH to SIXTH when answer is correct', async ({ assert }) => {
    const cardId = new CardId('card_555')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.FIFTH),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_555', true, userId)

    assert.equal(updatedCard.category.value, Category.SIXTH)
  })

  test('should promote card from SIXTH to SEVENTH when answer is correct', async ({ assert }) => {
    const cardId = new CardId('card_666')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.SIXTH),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_666', true, userId)

    assert.equal(updatedCard.category.value, Category.SEVENTH)
  })

  test('should promote card from SEVENTH to DONE when answer is correct', async ({ assert }) => {
    const cardId = new CardId('card_777')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.SEVENTH),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const updatedCard = await cardService.answerCard('card_777', true, userId)

    assert.equal(updatedCard.category.value, Category.DONE)
  })

  test('should update nextReviewDate when card is demoted to FIRST', async ({ assert }) => {
    const cardId = new CardId('card_date_1')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.THIRD),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const beforeDate = new Date()
    const updatedCard = await cardService.answerCard('card_date_1', false, userId)
    const afterDate = new Date()

    const expectedDate = new Date(beforeDate)
    expectedDate.setDate(expectedDate.getDate() + 1)

    const maxDate = new Date(afterDate.getTime() + 24 * 60 * 60 * 1000)

    assert.isTrue(updatedCard.nextReviewDate >= expectedDate)
    assert.isTrue(updatedCard.nextReviewDate <= maxDate)
  })

  test('should update nextReviewDate when card is promoted to SECOND', async ({ assert }) => {
    const cardId = new CardId('card_date_2')
    const card = new Card(
      cardId,
      'Question?',
      'Answer',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      new Date()
    )
    await mockRepository.save(card)

    const beforeDate = new Date()
    const updatedCard = await cardService.answerCard('card_date_2', true, userId)
    const afterDate = new Date()

    const expectedDate = new Date(beforeDate)
    expectedDate.setDate(expectedDate.getDate() + 2)

    const maxDate = new Date(afterDate.getTime() + 2 * 24 * 60 * 60 * 1000)

    assert.isTrue(updatedCard.nextReviewDate >= expectedDate)
    assert.isTrue(updatedCard.nextReviewDate <= maxDate)
  })
})
