import { User } from '#domain/entities/user'

type HttpContext = {
  request: {
    only: (keys: string[]) => Record<string, any>
  }
  response: {
    badRequest: (data: any) => any
    ok: (data: any) => any
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

    const user = new User(username, username)
    const token = `Bearer ${username}`

    return response.ok({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  }
}
