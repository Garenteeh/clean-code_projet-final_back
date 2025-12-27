import { test } from '@japa/runner'
import { QuizService } from '#application/services/quiz.service'
import { Card } from '#domain/entities/card'
import { CardId } from '#domain/value_objects/card_id.value_object'
import { CategoryValueObject, Category } from '#domain/value_objects/category.value_object'
import { CardRepositoryPort } from '#domain/ports/card_repository'
import { quizDailyLimitService } from '#domain/services/quiz_daily_limit.service'

class MockCardRepository implements CardRepositoryPort {
  private cards: Card[] = []

  setCards(cards: Card[]): void {
    this.cards = cards
  }

  async findAll(_userId: string, _tags?: string[]): Promise<Card[]> {
    return this.cards
  }

  async findById(_cardId: CardId, _userId: string): Promise<Card | null> {
    return null
  }

  async save(card: Card): Promise<Card> {
    this.cards.push(card)
    return card
  }

  async findCardsForQuiz(userId: string, _date: Date): Promise<Card[]> {
    return this.cards.filter((card) => card.userId === userId)
  }

  async update(card: Card): Promise<Card> {
    const index = this.cards.findIndex((c) => c.id.toString() === card.id.toString())
    if (index !== -1) {
      this.cards[index] = card
    }
    return card
  }
}

test.group('QuizService - Daily Limit Tests', (group) => {
  group.each.setup(() => {
    quizDailyLimitService.reset()
  })

  test('should throw error when user has already done quiz today', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const quizService = new QuizService(mockRepository)
    const userId = 'user_123'
    const today = new Date()

    const card = new Card(
      new CardId('card-1'),
      'Question 1',
      'Answer 1',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      undefined
    )
    mockRepository.setCards([card])

    quizDailyLimitService.recordQuiz(userId, today)

    await assert.rejects(
      () => quizService.getCardsForQuiz(userId, today),
      "Vous avez déjà fait un questionnaire aujourd'hui"
    )
  })

  test('should allow quiz when user has not done quiz today', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const quizService = new QuizService(mockRepository)
    const userId = 'user_123'
    const today = new Date()

    const card = new Card(
      new CardId('card-1'),
      'Question 1',
      'Answer 1',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      undefined
    )
    mockRepository.setCards([card])

    const cards = await quizService.getCardsForQuiz(userId, today)
    assert.isArray(cards)
    assert.lengthOf(cards, 1)
  })

  test('should record quiz date when cards are returned', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const quizService = new QuizService(mockRepository)
    const userId = 'user_123'
    const today = new Date()

    const card = new Card(
      new CardId('card-1'),
      'Question 1',
      'Answer 1',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      undefined
    )
    mockRepository.setCards([card])

    await quizService.getCardsForQuiz(userId, today)

    const hasQuiz = quizDailyLimitService.hasQuizToday(userId, today)
    assert.isTrue(hasQuiz)
  })

  test('should not record quiz date when no cards are returned', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const quizService = new QuizService(mockRepository)
    const userId = 'user_123'
    const today = new Date()

    mockRepository.setCards([])

    const cards = await quizService.getCardsForQuiz(userId, today)
    assert.lengthOf(cards, 0)

    const hasQuiz = quizDailyLimitService.hasQuizToday(userId, today)
    assert.isFalse(hasQuiz)
  })

  test('should not record quiz date when filtered cards are empty', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const quizService = new QuizService(mockRepository)
    const userId = 'user_123'
    const today = new Date()

    const card = new Card(
      new CardId('card-1'),
      'Question 1',
      'Answer 1',
      undefined,
      new CategoryValueObject(Category.DONE),
      userId,
      undefined
    )
    mockRepository.setCards([card])

    const cards = await quizService.getCardsForQuiz(userId, today)
    assert.lengthOf(cards, 0)

    const hasQuiz = quizDailyLimitService.hasQuizToday(userId, today)
    assert.isFalse(hasQuiz)
  })

  test('should allow quiz next day after doing quiz today', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const quizService = new QuizService(mockRepository)
    const userId = 'user_123'
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const card = new Card(
      new CardId('card-1'),
      'Question 1',
      'Answer 1',
      undefined,
      new CategoryValueObject(Category.FIRST),
      userId,
      undefined
    )
    mockRepository.setCards([card])

    await quizService.getCardsForQuiz(userId, today)

    const cardsTomorrow = await quizService.getCardsForQuiz(userId, tomorrow)
    assert.isArray(cardsTomorrow)
    assert.lengthOf(cardsTomorrow, 1)
  })

  test('should handle different users independently', async ({ assert }) => {
    const mockRepository = new MockCardRepository()
    const quizService = new QuizService(mockRepository)
    const user1 = 'user_1'
    const user2 = 'user_2'
    const today = new Date()

    const card1 = new Card(
      new CardId('card-1'),
      'Question 1',
      'Answer 1',
      undefined,
      new CategoryValueObject(Category.FIRST),
      user1,
      undefined
    )
    const card2 = new Card(
      new CardId('card-2'),
      'Question 2',
      'Answer 2',
      undefined,
      new CategoryValueObject(Category.FIRST),
      user2,
      undefined
    )
    mockRepository.setCards([card1, card2])

    await quizService.getCardsForQuiz(user1, today)

    const cardsUser2 = await quizService.getCardsForQuiz(user2, today)
    assert.isArray(cardsUser2)
    assert.lengthOf(cardsUser2, 1)
  })
})
