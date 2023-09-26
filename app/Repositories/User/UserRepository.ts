import User from 'App/Models/User'
import { IUser } from 'App/Repositories/User/UserRepositoryInterface'
import BaseRepository from 'App/Repositories/BaseRepositoryInterface'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

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

      await Database
        .table('rotation_user')
        .returning('id')
        .insert({
          user_id: user.id,
          rotation_id: params.rotationId,
          created_at: DateTime.local().toISO(),
          updated_at: DateTime.local().toISO(),
        })

      return user
    }
    return null
  }

  public async historyRotationById(id, paginate: IUser.DTO.PaginateQueryRotation) {
    return await Database
      .from('rotation_user')
      .where('user_id', id)
      .join('rotations', 'rotations.id', '=', 'rotation_user.rotation_id')
      .join('users', 'users.id', '=', 'rotation_user.user_id')
      .select(
        'rotation_user.*',
        'rotations.name as rotation_name', 'rotations.value as rotation_value',
        'users.email', 'users.username',
      )
      .orderBy('id', 'desc')
      .paginate(paginate.page, paginate.limit)
  }

}
