export interface JwtPayload {
  email: string;
  sub: string; // user id
  iat?: number;
  exp?: number;
}
