import { User } from '#domain/entities/user'

interface TokenVerificationResult {
  isValid: boolean
  userId?: string
  error?: string
}

interface UserFromToken {
  userId: string
  username?: string
}

export class AuthService {
  async verifyToken(token: string | undefined): Promise<TokenVerificationResult> {
    if (!token || token.trim() === '') {
      return {
        isValid: false,
        error: 'Token vide ou invalide',
      }
    }

    const cleanToken = token
      .trim()
      .replace(/^Bearer\s+/i, '')
      .trim()

    if (cleanToken === '') {
      return {
        isValid: false,
        error: 'Token vide ou invalide',
      }
    }

    return {
      isValid: true,
      userId: cleanToken,
    }
  }

  async getUserFromToken(token: string | undefined): Promise<UserFromToken | null> {
    const verification = await this.verifyToken(token)

    if (!verification.isValid || !verification.userId) {
      return {
        userId: 'default_user',
        username: 'default_user',
      }
    }

    return {
      userId: verification.userId,
      username: verification.userId,
    }
  }

  async login(username: string, _password: string): Promise<{ token: string; user: User }> {
    const user = new User(username, username)
    const token = `Bearer ${username}`

    return {
      token,
      user,
    }
  }

  async isAuthenticated(token: string | undefined): Promise<boolean> {
    const verification = await this.verifyToken(token)
    return verification.isValid
  }
}
