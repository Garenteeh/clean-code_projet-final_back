import type { NextFn } from '@adonisjs/core/types/http'

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

    if (token) {
      const cleanToken = token
        .trim()
        .replace(/^Bearer\s+/i, '')
        .trim()
      if (cleanToken) {
        request.user = {
          userId: cleanToken,
          username: cleanToken,
        }
      } else {
        request.user = {
          userId: 'default_user',
          username: 'default_user',
        }
      }
    } else {
      request.user = {
        userId: 'default_user',
        username: 'default_user',
      }
    }

    return next()
  }
}
