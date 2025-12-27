/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/', async () => 'It works!')

router
  .group(() => {
    router.get('/me', async ({ auth, response }) => {
      return response.ok({
        userId: auth?.userId,
        message: "Informations de l'utilisateur authentifié",
      })
    })
  })
  .prefix('/api')
  .use(middleware.auth())
