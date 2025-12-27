/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => 'It works!')

router.post('/auth/login', async (ctx) => {
  const AuthControllerModule = await import('#controllers/auth.controller')
  const AuthController = AuthControllerModule.default
  return new AuthController().login(ctx)
})

router
  .group(() => {
    router.get('/cards', async (ctx) => {
      const CardsControllerModule = await import('#controllers/cards.controller')
      const CardsController = CardsControllerModule.default
      return new CardsController().index(ctx)
    })

    router.post('/cards', async (ctx) => {
      const CardsControllerModule = await import('#controllers/cards.controller')
      const CardsController = CardsControllerModule.default
      return new CardsController().store(ctx)
    })

    router.get('/cards/quizz', async (ctx) => {
      const QuizControllerModule = await import('#controllers/quiz.controller')
      const QuizController = QuizControllerModule.default
      return new QuizController().getQuizCards(ctx)
    })

    router.patch('/cards/:cardId/answer', async (ctx) => {
      const QuizControllerModule = await import('#controllers/quiz.controller')
      const QuizController = QuizControllerModule.default
      return new QuizController().answer(ctx)
    })
  })
  .use(async (ctx, next) => {
    const AuthMiddlewareModule = await import('#middleware/auth_middleware')
    const AuthMiddleware = AuthMiddlewareModule.default
    const authMiddleware = new AuthMiddleware()
    return authMiddleware.handle(ctx, next)
  })
