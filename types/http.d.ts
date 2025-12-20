/**
 * Extension du contexte HTTP d'AdonisJS
 *
 * Ce fichier ajoute le typage TypeScript pour la propriété `auth`
 * qui est injectée par le AuthMiddleware dans le contexte HTTP.
 */

declare module '@adonisjs/core/http' {
  interface HttpContext {
    /**
     * Informations d'authentification de l'utilisateur
     * Injectées par le AuthMiddleware
     */
    auth?: {
      userId: string
    }
  }
}
