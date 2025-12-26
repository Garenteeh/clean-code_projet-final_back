/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => 'It works!')

router.get('/protected', async ({ response }) => {
  return response.ok({
    message: 'Vous êtes authentifié',
  })
})

router
  .group(() => {
    router.get('/me', async ({ response }) => {
      return response.ok({
        message: "Informations de l'utilisateur authentifié",
      })
    })
  })
  .prefix('/api')
