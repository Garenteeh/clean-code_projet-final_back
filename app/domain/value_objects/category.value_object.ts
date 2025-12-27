export enum Category {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  FOURTH = 'FOURTH',
  FIFTH = 'FIFTH',
  SIXTH = 'SIXTH',
  SEVENTH = 'SEVENTH',
  DONE = 'DONE',
}

export class CategoryValueObject {
  constructor(public readonly value: Category) {}

  static fromString(value: string): CategoryValueObject {
    if (!Object.values(Category).includes(value as Category)) {
      throw new Error(`Invalid category: ${value}`)
    }
    return new CategoryValueObject(value as Category)
  }

  equals(other: CategoryValueObject): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
