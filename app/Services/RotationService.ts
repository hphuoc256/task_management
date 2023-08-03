import { inject } from '@adonisjs/fold'
import RotationInterface from 'App/Repositories/Rotation/RotationInterface'
import Rotation from 'App/Models/Rotation'
import { add, toNumber } from 'lodash'
import UserRepository from 'App/Repositories/User/UserRepository'
import { IUser } from 'App/Repositories/User/UserRepositoryInterface'

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

  public async store(userId: number) {
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

  public randomRotationWithRate(rotations) {
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
}
