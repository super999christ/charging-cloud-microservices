import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
  @Inject(JwtService)
  private jwtService: JwtService;
  
  public generateToken(payload: Record<string, any>, expiresIn = 3600) {
    return this.jwtService.sign(payload, { expiresIn });
  }

  public validateToken(token: string) {
    try {
      const authToken = token.split(' ')[1];
      const decoded = this.jwtService.verify(authToken, { ignoreExpiration: false });
      return decoded;
    } catch(err) {
      return null;
    }
  }
}