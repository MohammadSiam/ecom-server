import * as statusCodes from './httpCodes';

export interface Response<T> {
  statusCode: Number;
  message: string;
  data?: T;
  error?: string;
  count?: number;
}

export const success = (data: any, count = 0): Response<any> => {
  if (count > 0) {
    return {
      statusCode: statusCodes.SUCCESS,
      message: 'Success',
      data: data,
      count: count,
    };
  } else {
    return {
      statusCode: statusCodes.SUCCESS,
      message: 'Success',
      data: data,
    };
  }
};
