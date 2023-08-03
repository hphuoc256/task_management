import * as crypto from 'crypto'
import ApiToken from 'App/Models/ApiToken'
import User from 'App/Models/User'
import { Socket } from 'socket.io'

export default class ApiTokenService {
  public static urlDecode(encoded) {
    return Buffer.from(encoded, 'base64').toString('utf-8')
  }

  public static generateHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  public static parseToken(token) {
    const parts = token.split('.')
    /**
     * Ensure the token has two parts
     */
    if (parts.length !== 2) {
      throw new Error('E_INVALID_API_TOKEN')
    }

    /**
     * Ensure the first part is a base64 encode id
     */
    const tokenId = this.urlDecode(parts[0])

    if (!tokenId) {
      throw new Error('E_INVALID_API_TOKEN')
    }

    const parsedToken = this.generateHash(parts[1])
    return {
      token: parsedToken,
      tokenId,
    }
  }

  public static async checkToken(token: string): Promise<User> {
    const parsedToken = this.parseToken(token)
    const apiToken = await ApiToken.query()
      .select('userId')
      .where('id', parsedToken.tokenId)
      .andWhere('token', parsedToken.token)
      .preload('user')
      .first()
    if (!apiToken) {
      throw new Error('E_INVALID_API_TOKEN')
    }
    return apiToken.user as User
  }

  public static async authenticate(socket: Socket): Promise<void> {
    const token = socket.handshake?.query?.token

    if (!token || typeof token !== 'string') {
      throw new Error('MissingParameter')
    }

    try {
      const user = await this.checkToken(token)
      console.log(user)
    } catch (error) {
      throw new Error('BadCredentials')
    }
  }
}
