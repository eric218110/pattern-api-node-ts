import { connectionDatabase } from '../../utils/create-connections'
import { AddPointModelData } from '@data/models/point-model'
import { PointTypeOrmRepository } from './point-typeorm-repository'
import { Repository } from 'typeorm'
import { EntityItem } from '../../entities/item.entity'
import { EntityAccount } from '../../entities/account.entity'

let itemTypeOrmRepository: Repository<EntityItem>
let accountTypeOrmRepository: Repository<EntityAccount>

interface SutTypes {
  sut: PointTypeOrmRepository
}

const makeAddPointFake = (): AddPointModelData => ({
  account: {
    id: 'any_id_account',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    accessToken: 'any_accessToken',
    role: 'any_role'
  },
  name: 'any_name',
  phone: 'any_phone',
  city: 'any_city',
  state: 'any_state',
  image: 'any_image',
  items: [],
  latitude: '7895',
  longitude: '7865'
})

const makeSut = (): SutTypes => {
  const sut = new PointTypeOrmRepository()
  return {
    sut
  }
}

const makeFakeItems = async (): Promise<EntityItem[]> => {
  const createFirstItem = itemTypeOrmRepository.create({
    image: 'http://any_image_first_item.com',
    title: 'Any First Item Image'
  })
  const saveFirstItem = await itemTypeOrmRepository.save(createFirstItem)
  const createSecondItem = itemTypeOrmRepository.create({
    image: 'http://any_image_Second_item.com',
    title: 'Any Second Item Image'
  })
  const saveSecondItem = await itemTypeOrmRepository.save(createSecondItem)
  return [saveFirstItem, saveSecondItem]
}

const makeFakeAccount = async (): Promise<EntityAccount> => {
  const createAccount = accountTypeOrmRepository.create({
    name: 'any_name_account',
    email: 'any_email_account',
    password: 'any_password_account',
    accessToken: 'any_accessToken_account',
    role: 'any_role_account'
  })
  const saveAccount = accountTypeOrmRepository.save(createAccount)
  return saveAccount
}

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  await connectionDatabase.clear()
  itemTypeOrmRepository = connection.getRepository(EntityItem)
  accountTypeOrmRepository = connection.getRepository(EntityAccount)
})

afterAll(async () => {
  await connectionDatabase.close()
})

beforeEach(async () => {
  await connectionDatabase.clear()
})

describe('PointTypeOrmRepository', () => {
  describe('Add', () => {
    test('should return null if account not exist in database', async () => {
      const { sut } = makeSut()
      const fakePoint = makeAddPointFake()
      fakePoint.items = await makeFakeItems()
      const point = await sut.addNewPoint(fakePoint)
      expect(point).toBeNull()
    })

    test('should return null if item is empty', async () => {
      const { sut } = makeSut()
      const fakePoint = makeAddPointFake()
      fakePoint.account = await makeFakeAccount()
      const point = await sut.addNewPoint(fakePoint)
      expect(point).toBeNull()
    })

    test('should return null if item no empty but items not exists in database', async () => {
      const { sut } = makeSut()
      const fakePoint = makeAddPointFake()
      fakePoint.account = await makeFakeAccount()
      fakePoint.items = [
        {
          id: 'first_invalid_id_item',
          image: 'http://first_invalid_image_url.com',
          title: 'First Invalid Image'
        },
        {
          id: 'seconf_invalid_id_item',
          image: 'http://seconf_invalid_image_url.com',
          title: 'Seconf Invalid Image'
        }
      ]
      const point = await sut.addNewPoint(fakePoint)
      expect(point).toBeNull()
    })

    test('should return point if add success', async () => {
      const { sut } = makeSut()
      const fakePoint = makeAddPointFake()
      fakePoint.account = await makeFakeAccount()
      fakePoint.items = await makeFakeItems()
      const point = await sut.addNewPoint(fakePoint)
      expect(point).toBeTruthy()
      expect(point.id).toBeTruthy()
    })
  })
})