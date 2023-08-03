import { ErrorCode } from 'App/Utils/ErrorCode'

export class ApiResponse {
  /**
   * Success response format
   *
   * @param response
   * @param {Object} data
   * @param {string} message
   * @param status
   * @return {Object}
   */
  static success(response, data, message = 'SUCCESS', status: number = 200) {
    return response.status(status).json({
      status: true,
      code: 0,
      message: message,
      data: data || [],
    })
  }

  /**
   * Error response format
   *
   * @param response
   * @param error
   * @param code
   * @return {Object}
   */
  static error(response, error, code?: number) {
    return response.status(200).json({
      status: false,
      code: code || 1000,
      message: ErrorCode[code || 1000],
      error: error,
    })
  }
}

