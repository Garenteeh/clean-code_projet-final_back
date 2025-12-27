import { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#application/services/AuthService'

const authService = new AuthService()

export default async function authMiddleware({ request }: HttpContext, next: () => Promise<void>) {
  const token = request.header('Authorization')
  request.user = await authService.getUserFromToken(token)
  await next()
}
