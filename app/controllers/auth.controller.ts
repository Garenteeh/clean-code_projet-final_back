import { AuthService } from '#application/services/auth.service'

const authService = new AuthService()

type HttpContext = {
  request: {
    only: (keys: string[]) => Record<string, any>
  }
  response: {
    badRequest: (data: any) => any
    ok: (data: any) => any
    internalServerError: (data: any) => any
  }
}

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    if (!username || !password) {
      return response.badRequest({
        error: 'Username et password sont requis',
      })
    }

    try {
      const { token, user } = await authService.login(username, password)

      return response.ok({
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      })
    } catch (error) {
      return response.internalServerError({
        error: 'Erreur lors de la connexion',
      })
    }
  }
}
