import { inject } from '@adonisjs/fold'
import RotationInterface from 'App/Repositories/Rotation/RotationInterface'
import Rotation from 'App/Models/Rotation'
import { add, toNumber } from 'lodash'
import UserRepository from 'App/Repositories/User/UserRepository'
import { IUser } from 'App/Repositories/User/UserRepositoryInterface'
import { IRotation } from 'App/Repositories/Rotation/RotationRepositoryInterface'

@inject()
export default class RotationService {
  constructor(
    protected repo: RotationInterface,
    protected userRepository: UserRepository,
  ) {
  }

  public async list(): Promise<Rotation[]> {
    return await this.repo.getList()
  }

  public async make(userId: number) {
    const rotations = await this.repo.getList()
    if (!rotations) return []

    // Random rotations
    const randomRotation = this.randomRotationWithRate(rotations)

    // Get user update
    const user = await this.userRepository.findBy('id', userId)

    const pointRandomRotation = parseFloat(randomRotation.value)

    const params = {
      userId,
      rotationId: randomRotation.id,
      point: add(toNumber(user?.point || 0), pointRandomRotation),
    } as IUser.DTO.UpdatePoint

    const result = await this.userRepository.updatePoint(params)
    if (!result) return []

    return randomRotation
  }

  protected randomRotationWithRate(rotations) {
    // sum probabilities
    const totalRate = rotations.reduce((acc, obj) => acc + obj.rate, 0)

    // cumulative array
    const cumulativeProbabilities = [] as number[]
    let cumulativeRate = 0
    for (const rotation of rotations) {
      cumulativeRate += rotation.rate / totalRate
      cumulativeProbabilities.push(toNumber(cumulativeRate))
    }

    // random number from 0 to 1
    const randomValue = Math.random()

    // random item
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
      if (randomValue < cumulativeProbabilities[i]) {
        return rotations[i]
      }
    }

    // if error return last item
    return rotations[rotations.length - 1]
  }

  public async store(params: IRotation.DTO.Store): Promise<Rotation> {
    return await this.repo.store(params)
  }

  public async update(id, params: IRotation.DTO.Update): Promise<Rotation | number> {
    const rotation = await this.repo.findBy('id', id)
    if (!rotation) return 70

    try {
      rotation.merge(params)
      await this.repo.save(rotation)
      return rotation
    } catch (e) {
      return 73
    }
  }

  public async findById(id): Promise<Rotation | null> {
    return await this.repo.findBy('id', id)
  }

  public async delete(id: number): Promise<boolean> {
    const rotation = await this.repo.findBy('id', id)
    if (!rotation) return false

    await rotation.delete()
    return true
  }
}
