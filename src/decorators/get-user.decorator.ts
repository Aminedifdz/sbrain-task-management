import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request: Express.Request = ctx
      .switchToHttp()
      .getRequest();
    if (data) {
      // console.log(
      //   `request : ${JSON.stringify(
      //     Flatened.removeCircularReferences(
      //       request,
      //     ),
      //   )}`,
      // ); // To Delete
      return request.user
        ? request.user[data]
        : null;
    }
    return request.user;
  },
);
