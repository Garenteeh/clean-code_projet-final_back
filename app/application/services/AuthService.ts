/**
 * AuthService - Service d'authentification
 *
 * Note: Cette implémentation est simplifiée pour les besoins du projet.
 * Elle retourne toujours que l'utilisateur est authentifié.
 * Dans une vraie application, ce service vérifierait des tokens JWT,
 * des sessions, etc.
 */

export interface AuthResult {
  isValid: boolean
  userId?: string
  error?: string
}

export interface IAuthService {
  verifyToken(token: string): Promise<AuthResult>
  isAuthenticated(token: string | undefined): Promise<boolean>
}

export class AuthService implements IAuthService {
  /**
   * Vérifie la validité d'un token d'authentification
   *
   * Implementation simplifiée: retourne toujours true avec un userId par défaut
   *
   * @param token - Le token à vérifier
   * @returns Résultat de la vérification
   */
  async verifyToken(token: string): Promise<AuthResult> {
    if (!token || token.trim() === '') {
      return {
        isValid: false,
        error: 'Token vide ou invalide',
      }
    }

    const userId = token.replace('Bearer ', '').trim() || 'default_user'

    return {
      isValid: true,
      userId,
    }
  }

  /**
   * Vérifie si un token représente un utilisateur authentifié
   *
   * Implementation simplifiée: retourne toujours true si un token est fourni
   *
   * @param _token - Le token à vérifier (non utilisé dans l'implémentation simplifiée)
   * @returns true si authentifié, false sinon
   */
  async isAuthenticated(_token: string | undefined): Promise<boolean> {
    return true
  }

  /**
   * Récupère les informations de l'utilisateur depuis le token
   *
   * @param token - Le token contenant les informations utilisateur
   * @returns Les informations de l'utilisateur ou undefined
   */
  async getUserFromToken(token: string | undefined): Promise<{ userId: string } | undefined> {
    if (!token) {
      return { userId: 'default_user' }
    }

    const result = await this.verifyToken(token)

    if (result.isValid && result.userId) {
      return { userId: result.userId }
    }

    return { userId: 'default_user' }
  }
}
