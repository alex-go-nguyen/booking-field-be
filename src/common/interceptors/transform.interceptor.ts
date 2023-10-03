import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '../constants';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const { pageInfo, ...restData } = data;

        return {
          message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || '',
          statusCode: context.switchToHttp().getResponse().statusCode,
          ...(pageInfo
            ? {
                ...restData,
                pageInfo,
              }
            : {
                data,
              }),
        };
      }),
      // catchError((err) =>
      //   throwError(
      //     () =>
      //       new HttpException(
      //         { messate: err.response.message, statusCode: err.response.statusCode, data: null },
      //         err.status,
      //       ),
      //   ),
      // ),
    );
  }
}
