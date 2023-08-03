import crypto from 'crypto'
import User from 'App/Models/User'
import ApiToken from 'App/Models/ApiToken'
import { Socket } from 'socket.io'

export const urlDecode = (encoded) => {
  return Buffer.from(encoded, 'base64').toString('utf-8')
}

export const generateHash = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export const parseToken = (token) => {
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
  const tokenId = urlDecode(parts[0])

  if (!tokenId) {
    throw new Error('E_INVALID_API_TOKEN')
  }

  const parsedToken = generateHash(parts[1])
  return {
    token: parsedToken,
    tokenId,
  }
}

export const checkToken = async (token: string): Promise<User> => {
  const parsedToken = parseToken(token)
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

export const authenticate = async (socket: Socket): Promise<User> => {
  const token = socket.handshake?.auth?.token

  if (!token || typeof token !== 'string') {
    throw new Error('MISSING_PARAMETER')
  }

  try {
    return await checkToken(token)
  } catch (error) {
    throw new Error('BAD_CREDENTIALS')
  }
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms || 1000)
  })
}

export const isEndAtGreaterThanStartAtWithMargin = (startAt , endAt) => {
  const marginMinutes = 30
  const diffInMinutes = (endAt - startAt) / (1000 * 60) // Difference in minutes
  return diffInMinutes >= marginMinutes
}
