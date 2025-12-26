import { User } from '../entities/user.js'

export abstract class AuthRepositoryPort {
  abstract isAuthenticated(): Promise<User>
}
