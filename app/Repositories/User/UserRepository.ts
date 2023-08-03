import User from 'App/Models/User'
import { IUser } from 'App/Repositories/User/UserRepositoryInterface'
import BaseRepository from 'App/Repositories/BaseRepositoryInterface'

export default class UserRepository
  extends BaseRepository<typeof User>
  implements IUser.Repository {
  constructor() {
    super(User)
  }


  public async updatePoint(params: IUser.DTO.UpdatePoint): Promise<User | null> {
    const user = await User.find(params.userId)
    if (user) {
      user.point = params.point
      await user.save()

      await user.related('rotations')
        .attach([params.rotationId])

      return user
    }
    return null
  }

}
