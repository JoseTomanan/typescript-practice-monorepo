import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';



@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey !== 'ecommerce123') {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
