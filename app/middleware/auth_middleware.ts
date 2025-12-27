import type { NextFn } from '@adonisjs/core/types/http'
import { AuthService } from '#application/services/auth.service'

const authService = new AuthService()

type HttpContext = {
  request: {
    header: (name: string) => string | undefined
    user?: {
      userId: string
      username?: string
    }
  }
}

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const token = request.header('Authorization')
    const user = await authService.getUserFromToken(token)
    request.user = user || undefined
    return next()
  }
}
