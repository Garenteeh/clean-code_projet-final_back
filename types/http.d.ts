/**
 * Extension du contexte HTTP d'AdonisJS
 *
 * Ce fichier ajoute le typage TypeScript pour la propriété `user`
 * qui est injectée par le AuthMiddleware dans le contexte HTTP.
 */

declare module '@adonisjs/core/http' {
  interface Request {
    /**
     * Informations d'authentification de l'utilisateur
     * Injectées par le AuthMiddleware
     */
    user?: {
      userId: string
      username?: string
    }
  }
}
