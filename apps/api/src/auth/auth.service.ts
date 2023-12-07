import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as jwt from 'jsonwebtoken';
import * as queryString from 'querystring';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from 'src/config/config.service';
import { AppTokensDTO, KeycloakToken } from '@tbcm/common';
import { KeycloakUser } from '@tbcm/common';

@Injectable()
export class AuthService {
  private keycloakAuthServerUri: string;

  private keycloakResponseType: string;

  private keycloakRealm: string;

  private keycloakRedirectUri: string;

  private keycloakClientId: string;

  private keycloakClientSecret: string;

  private keycloakTokenUri: string;

  private keycloakUserInfoUri: string;

  private keycloakLogoutUri: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.keycloakAuthServerUri = this.configService.getValue('KEYCLOAK_AUTH_SERVER_URI');
    this.keycloakResponseType = this.configService.getValue('KEYCLOAK_RESPONSE_TYPE');
    this.keycloakRealm = this.configService.getValue('KEYCLOAK_REALM');
    this.keycloakRedirectUri = this.configService.getValue('KEYCLOAK_REDIRECT_URI');
    this.keycloakClientId = this.configService.getValue('KEYCLOAK_CLIENT_ID');
    this.keycloakClientSecret = this.configService.getValue('KEYCLOAK_CLIENT_SECRET');
    this.keycloakUserInfoUri = this.configService.getValue('KEYCLOAK_USER_INFO_URI');
    this.keycloakTokenUri = this.configService.getValue('KEYCLOAK_TOKEN_URI');
    this.keycloakLogoutUri = this.configService.getValue('KEYCLOAK_LOGOUT_URI');
  }

  getUrlLogin(): any {
    return {
      url:
        `${this.keycloakAuthServerUri}` +
        `/realms/${this.keycloakRealm}/protocol/openid-connect/auth` +
        `?client_id=${this.keycloakClientId}` +
        `&response_type=${this.keycloakResponseType}` +
        `&redirect_uri=${this.keycloakRedirectUri}`,
    };
  }

  async getAccessToken(code: string): Promise<KeycloakToken> {
    const params = {
      grant_type: 'authorization_code',
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      code: code,
      redirect_uri: this.keycloakRedirectUri,
    };

    const data = await firstValueFrom(
      this.httpService
        .post(this.keycloakTokenUri, queryString.stringify(params), this.getContentType())
        .pipe(
          map(
            (res: any) =>
              new KeycloakToken(
                res.data.access_token,
                res.data.refresh_token,
                res.data.expires_in,
                res.data.refresh_expires_in,
              ),
          ),
          catchError(e => {
            console.error('AuthService::getAccessToken');
            throw new HttpException(
              e?.response?.data?.error || 'Error data unknown, Something Went wrong',
              e?.response?.status || 500,
            );
          }),
        ),
    );
    return data;
  }

  async getUserInfo(accessToken: string): Promise<KeycloakUser> {
    const params = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const data = await firstValueFrom(
      this.httpService.get(this.keycloakUserInfoUri, params).pipe(
        map((res: any) => {
          // roles does not exist in the userinfo, extracting from the token
          const { resource_access } = jwt.decode(accessToken) as KeycloakUser;

          // return response + roles
          return { resource_access, ...res.data } as KeycloakUser;
        }),
        catchError(e => {
          console.error('AuthService::getUserInfo');
          throw new HttpException(
            e?.response?.data?.error || 'Error data unknown, Something Went wrong',
            e?.response?.status || 500,
          );
        }),
      ),
    );

    return data;
  }

  async refreshAccessToken(refresh_token: string): Promise<KeycloakToken> {
    const params = {
      grant_type: 'refresh_token',
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      refresh_token: refresh_token,
      redirect_uri: this.keycloakRedirectUri,
    };

    const data = await firstValueFrom(
      this.httpService
        .post(this.keycloakTokenUri, queryString.stringify(params), this.getContentType())
        .pipe(
          map(
            (res: any) =>
              new KeycloakToken(
                res.data.access_token,
                res.data.refresh_token,
                res.data.expires_in,
                res.data.refresh_expires_in,
              ),
          ),
          catchError(e => {
            console.error('AuthService::refreshAccessToken');
            throw new HttpException(
              e?.response?.data?.error || 'Error data unknown, Something Went wrong',
              e?.response?.status || 500,
            );
          }),
        ),
    );
    return data;
  }

  async logout(tokens: AppTokensDTO) {
    const params = {
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      refresh_token: tokens.refresh_token,
      id_token_hint: tokens.access_token,
      post_logout_redirect_uri: '/'
    };

    const data = await firstValueFrom(
      this.httpService
        .post(this.keycloakLogoutUri, queryString.stringify(params), this.getContentType())
        .pipe(
          map((res: any) => res.data),
          catchError(e => {
            console.error('AuthService::revokeRefresh');
            throw new HttpException(
              e?.response?.data?.error || 'Error data unknown, Something Went wrong',
              e?.response?.status || 500,
            );
          }),
        ),
    );
    return data;
  }

  getContentType() {
    return { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  }
}
