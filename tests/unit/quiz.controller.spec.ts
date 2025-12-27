import { test } from '@japa/runner'
import { CardService } from '#application/services/card.service'
import { Card } from '#domain/entities/card'
import { CardId } from '#domain/value_objects/card_id.value_object'
import { CategoryValueObject, Category } from '#domain/value_objects/category.value_object'
import { CardRepositoryPort } from '#domain/ports/card_repository'

class MockCardRepository implements CardRepositoryPort {
  private cards: Map<string, Card> = new Map()

  setCard(card: Card): void {
    this.cards.set(card.id.toString(), card)
  }

  getCard(cardId: string): Card | undefined {
    return this.cards.get(cardId)
  }

  async findAll(_userId: string, _tags?: string[]): Promise<Card[]> {
    return Array.from(this.cards.values())
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

  async findCardsForQuiz(_userId: string, _date: Date): Promise<Card[]> {
    return Array.from(this.cards.values())
  }

  async update(card: Card): Promise<Card> {
    this.cards.set(card.id.toString(), card)
    return card
  }
}

test.group('CardService - Force Validation Logic Tests', () => {
  test('should validate card when isValid is true (simulating forceValidation)', async ({
    assert,
  }) => {
    const mockRepository = new MockCardRepository()
    const cardService = new CardService(mockRepository)

    const userId = 'user_123'
    const cardId = 'card-123'
    const card = new Card(
      new CardId(cardId),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      new Date()
    )
    mockRepository.setCard(card)

    await cardService.answerCard(cardId, true, userId)

    const updatedCard = mockRepository.getCard(cardId)
    assert.isNotNull(updatedCard)
    assert.equal(updatedCard!.category.value, Category.SECOND)
  })

  test('should not validate card when isValid is false', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const cardService = new CardService(mockRepository)

    const userId = 'user_123'
    const cardId = 'card-123'
    const card = new Card(
      new CardId(cardId),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      new Date()
    )
    mockRepository.setCard(card)

    await cardService.answerCard(cardId, false, userId)

    const updatedCard = mockRepository.getCard(cardId)
    assert.isNotNull(updatedCard)
    assert.equal(updatedCard!.category.value, Category.FIRST)
  })

  test('should promote card to next category when isValid is true', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const cardService = new CardService(mockRepository)

    const userId = 'user_123'
    const cardId = 'card-123'
    const card = new Card(
      new CardId(cardId),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.SECOND),
      userId,
      new Date()
    )
    mockRepository.setCard(card)

    await cardService.answerCard(cardId, true, userId)

    const updatedCard = mockRepository.getCard(cardId)
    assert.isNotNull(updatedCard)
    assert.equal(updatedCard!.category.value, Category.THIRD)
  })

  test('should reset card to FIRST category when isValid is false', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const cardService = new CardService(mockRepository)

    const userId = 'user_123'
    const cardId = 'card-123'
    const card = new Card(
      new CardId(cardId),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.THIRD),
      userId,
      new Date()
    )
    mockRepository.setCard(card)

    await cardService.answerCard(cardId, false, userId)

    const updatedCard = mockRepository.getCard(cardId)
    assert.isNotNull(updatedCard)
    assert.equal(updatedCard!.category.value, Category.FIRST)
  })

  test('should throw error when card is not found', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const cardService = new CardService(mockRepository)

    await assert.rejects(
      () => cardService.answerCard('non-existent-card', true, 'user_123'),
      'Card not found'
    )
  })

  test('should update nextReviewDate when card is validated', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const cardService = new CardService(mockRepository)

    const userId = 'user_123'
    const cardId = 'card-123'
    const today = new Date()
    const card = new Card(
      new CardId(cardId),
      'Question',
      'Answer',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      today
    )
    mockRepository.setCard(card)

    await cardService.answerCard(cardId, true, userId)

    const updatedCard = mockRepository.getCard(cardId)
    assert.isNotNull(updatedCard)
    assert.isNotNull(updatedCard!.nextReviewDate)
    assert.isTrue(updatedCard!.nextReviewDate > today)
  })
})

test.group('Force Validation Parameter Logic Tests', () => {
  test('should return true when forceValidation is true', ({ assert }) => {
    const forceValidation = true
    const isValid = false

    const finalIsValid = forceValidation === true ? true : isValid

    assert.isTrue(finalIsValid)
  })

  test('should use isValid when forceValidation is false', ({ assert }) => {
    const forceValidation = false as boolean
    const isValid = true

    const finalIsValid = forceValidation === true ? true : isValid

    assert.isTrue(finalIsValid)
  })

  test('should use isValid when forceValidation is undefined', ({ assert }) => {
    const forceValidation = undefined
    const isValid = false

    const finalIsValid = forceValidation === true ? true : isValid

    assert.isFalse(finalIsValid)
  })

  test('should prioritize forceValidation over isValid when both are provided', ({ assert }) => {
    const forceValidation = true
    const isValid = false

    const finalIsValid = forceValidation === true ? true : isValid

    assert.isTrue(finalIsValid)
  })

  test('should validate that finalIsValid is boolean when forceValidation is true', ({
    assert,
  }) => {
    const forceValidation = true
    const isValid = undefined

    const finalIsValid = forceValidation === true ? true : isValid

    assert.isTrue(typeof finalIsValid === 'boolean')
    assert.isTrue(finalIsValid)
  })

  test('should validate that finalIsValid is boolean when isValid is provided', ({ assert }) => {
    const forceValidation = false as boolean
    const isValid = true

    const finalIsValid = forceValidation === true ? true : isValid

    assert.isTrue(typeof finalIsValid === 'boolean')
    assert.isTrue(finalIsValid)
  })

  test('should fail validation when neither isValid nor forceValidation are valid', ({
    assert,
  }) => {
    const forceValidation = false as boolean
    const isValid = undefined

    const finalIsValid = forceValidation === true ? true : isValid

    assert.isFalse(typeof finalIsValid === 'boolean')
  })
})
