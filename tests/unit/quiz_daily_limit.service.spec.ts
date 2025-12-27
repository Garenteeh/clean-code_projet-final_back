import { test } from '@japa/runner'
import { QuizDailyLimitServiceSingleton } from '#domain/services/quiz_daily_limit.service'

test.group('QuizDailyLimitService - Unit Tests', () => {
  test('should create an instance of QuizDailyLimitService', ({ assert }) => {
    const service = new QuizDailyLimitServiceSingleton()
    assert.isDefined(service)
    assert.instanceOf(service, QuizDailyLimitServiceSingleton)
  })

  test('should return false when user has not done any quiz', ({ assert }) => {
    const service = new QuizDailyLimitServiceSingleton()
    const userId = 'user_123'
    const today = new Date()

    const hasQuiz = service.hasQuizToday(userId, today)
    assert.isFalse(hasQuiz)
  })

  test('should return true when user has done quiz today', ({ assert }) => {
    const service = new QuizDailyLimitServiceSingleton()
    const userId = 'user_123'
    const today = new Date()

    service.recordQuiz(userId, today)
    const hasQuiz = service.hasQuizToday(userId, today)
    assert.isTrue(hasQuiz)
  })

  test('should return false when user did quiz yesterday but not today', ({ assert }) => {
    const service = new QuizDailyLimitServiceSingleton()
    const userId = 'user_123'
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const today = new Date()

    service.recordQuiz(userId, yesterday)
    const hasQuiz = service.hasQuizToday(userId, today)
    assert.isFalse(hasQuiz)
  })

  test('should return true when user did quiz today at different times', ({ assert }) => {
    const service = new QuizDailyLimitServiceSingleton()
    const userId = 'user_123'
    const morning = new Date(2024, 0, 15, 8, 0, 0)
    const evening = new Date(2024, 0, 15, 20, 0, 0)

    service.recordQuiz(userId, morning)
    const hasQuiz = service.hasQuizToday(userId, evening)
    assert.isTrue(hasQuiz)
  })

  test('should return false when user did quiz tomorrow', ({ assert }) => {
    const service = new QuizDailyLimitServiceSingleton()
    const userId = 'user_123'
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    service.recordQuiz(userId, tomorrow)
    const hasQuiz = service.hasQuizToday(userId, today)
    assert.isFalse(hasQuiz)
  })

  test('should handle multiple users independently', ({ assert }) => {
    const service = new QuizDailyLimitServiceSingleton()
    const user1 = 'user_1'
    const user2 = 'user_2'
    const today = new Date()

    service.recordQuiz(user1, today)
    const hasQuizUser1 = service.hasQuizToday(user1, today)
    const hasQuizUser2 = service.hasQuizToday(user2, today)

    assert.isTrue(hasQuizUser1)
    assert.isFalse(hasQuizUser2)
  })

  test('should overwrite previous quiz date for same user', ({ assert }) => {
    const service = new QuizDailyLimitServiceSingleton()
    const userId = 'user_123'
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const today = new Date()

    service.recordQuiz(userId, yesterday)
    service.recordQuiz(userId, today)

    const hasQuizToday = service.hasQuizToday(userId, today)
    const hasQuizYesterday = service.hasQuizToday(userId, yesterday)

    assert.isTrue(hasQuizToday)
    assert.isFalse(hasQuizYesterday)
  })
})
