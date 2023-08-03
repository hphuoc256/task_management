import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'admin@gmail.com',
        password: 'password',
        username: 'admin',
      },
      {
        email: 'user@gmail.com',
        password: 'password',
        username: 'user',
      },
      {
        email: 'user1@gmail.com',
        password: 'password',
        username: 'user1',
      },
      {
        email: 'user2@gmail.com',
        password: 'password',
        username: 'user2',
      },
    ])
  }
}
