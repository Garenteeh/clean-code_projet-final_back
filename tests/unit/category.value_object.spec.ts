import { test } from '@japa/runner'
import { Category, CategoryValueObject } from '#domain/value_objects/category.value_object'

test.group('Category Value Object', () => {
  test('should create a valid CategoryValueObject', ({ assert }) => {
    const category = new CategoryValueObject(Category.FIRST)
    assert.equal(category.value, Category.FIRST)
  })

  test('should create CategoryValueObject from valid string', ({ assert }) => {
    const category = CategoryValueObject.fromString('FIRST')
    assert.equal(category.value, Category.FIRST)
  })

  test('should throw error when creating from invalid string', ({ assert }) => {
    assert.throws(() => CategoryValueObject.fromString('INVALID'), 'Invalid category: INVALID')
  })

  test('should create all valid categories from strings', ({ assert }) => {
    const categories = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'DONE']

    categories.forEach((cat) => {
      const category = CategoryValueObject.fromString(cat)
      assert.equal(category.value, cat)
    })
  })

  test('should compare two CategoryValueObjects correctly - equal', ({ assert }) => {
    const cat1 = new CategoryValueObject(Category.SECOND)
    const cat2 = new CategoryValueObject(Category.SECOND)
    assert.isTrue(cat1.equals(cat2))
  })

  test('should compare two CategoryValueObjects correctly - not equal', ({ assert }) => {
    const cat1 = new CategoryValueObject(Category.FIRST)
    const cat2 = new CategoryValueObject(Category.THIRD)
    assert.isFalse(cat1.equals(cat2))
  })

  test('should convert CategoryValueObject to string', ({ assert }) => {
    const category = new CategoryValueObject(Category.FOURTH)
    assert.equal(category.toString(), 'FOURTH')
  })
})
