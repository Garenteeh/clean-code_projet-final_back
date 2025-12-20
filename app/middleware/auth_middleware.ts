import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { AuthService } from '#application/services/AuthService'

/**
 * AuthMiddleware - Middleware d'authentification
 *
 * Responsabilités:
 * - Intercepter les requêtes HTTP vers les routes protégées
 * - Extraire le token du header Authorization
 * - Utiliser AuthService pour vérifier l'authentification
 * - Enrichir le contexte HTTP avec les informations utilisateur
 * - Retourner 401 si non authentifié (dans une vraie implémentation)
 *
 * Note: Cette implémentation est simplifiée pour les besoins du projet.
 * Elle laisse toujours passer les requêtes (l'utilisateur est toujours authentifié).
 */
export default class AuthMiddleware {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  /**
   * Gère la vérification d'authentification pour chaque requête
   *
   * Implementation simplifiée: enrichit toujours le contexte avec un userId,
   * conformément aux exigences du projet (architecture présente mais pas de vraie implémentation)
   *
   * @param ctx - Le contexte HTTP de la requête
   * @param next - La fonction pour passer à l'étape suivante
   */
  async handle(ctx: HttpContext, next: NextFn): Promise<void> {
    // Extraction du token depuis le header Authorization
    const authHeader = ctx.request.header('Authorization')
    const token = authHeader?.replace('Bearer ', '').trim()


    const user = await this.authService.getUserFromToken(token)

    ctx.auth = user

    await next()
  }
}
