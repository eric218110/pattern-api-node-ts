import { LoadItemsByIdsRepository } from '@data/protocols/data/items/load-items-by-ids-repository'
import { ItemModel } from '../add-items/db-add-items-protocols'

export class DbLoadItemsByIdsRepository implements LoadItemsByIdsRepository {
  constructor(
    private readonly loadItemsByIdsRepository: LoadItemsByIdsRepository
  ) {}

  async loadItems(idsItems: string[]): Promise<ItemModel[]> {
    if (idsItems.length === 0) return null
    await this.loadItemsByIdsRepository.loadItems(idsItems)
  }
}
