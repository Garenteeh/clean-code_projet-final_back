import { AuthRepositoryPort } from '#domain/ports/auth_repository'
import { User } from '#domain/entities/user'

export default class AuthRepository implements AuthRepositoryPort {
  async isAuthenticated(): Promise<User> {
    return Promise.resolve(new User('1', 'Sagby'))
  }
}
