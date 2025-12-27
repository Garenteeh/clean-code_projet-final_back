export class QuizDailyLimitServiceSingleton {
  private lastQuizDates: Map<string, Date> = new Map()

  hasQuizToday(userId: string, date: Date): boolean {
    const lastQuizDate = this.lastQuizDates.get(userId)
    if (!lastQuizDate) {
      return false
    }

    return this.isSameDay(lastQuizDate, date)
  }

  recordQuiz(userId: string, date: Date): void {
    this.lastQuizDates.set(userId, date)
  }

  reset(): void {
    this.lastQuizDates.clear()
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }
}

export const quizDailyLimitService = new QuizDailyLimitServiceSingleton()
export type QuizDailyLimitService = QuizDailyLimitServiceSingleton
