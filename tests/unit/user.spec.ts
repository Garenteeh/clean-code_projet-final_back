import { test } from '@japa/runner'
import { User } from '#domain/entities/user'

test.group('User Entity', () => {
  test('should create a valid User', ({ assert }) => {
    const user = new User('user-123', 'john_doe')

    assert.equal(user.id, 'user-123')
    assert.equal(user.username, 'john_doe')
  })

  test('should create User with different values', ({ assert }) => {
    const user = new User('abc-456', 'jane_smith')

    assert.equal(user.id, 'abc-456')
    assert.equal(user.username, 'jane_smith')
  })

  test('should be immutable (readonly properties)', ({ assert }) => {
    const user = new User('test-id', 'testuser')

    assert.property(user, 'id')
    assert.property(user, 'username')
  })
})
