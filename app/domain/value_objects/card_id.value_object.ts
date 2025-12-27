export class CardId {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('CardId cannot be empty')
    }
  }

  equals(other: CardId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
