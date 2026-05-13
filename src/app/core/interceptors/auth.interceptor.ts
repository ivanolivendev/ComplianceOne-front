import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

// Rotas públicas que NÃO devem receber o token de autenticação
const PUBLIC_ENDPOINTS = [
  '/api/v1/ocorrencias/protocolo/',
  '/api/v1/auth/'
];

// Rotas que são públicas apenas para POST (criação de denúncia)
const PUBLIC_POST_ENDPOINTS = [
  '/api/v1/ocorrencias'
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  // Não adiciona token para endpoints públicos
  const isPublicGet = PUBLIC_ENDPOINTS.some(endpoint => req.url.includes(endpoint));
  const isPublicPost = req.method === 'POST' && PUBLIC_POST_ENDPOINTS.some(endpoint => req.url.endsWith(endpoint));
  const isPublic = isPublicGet || isPublicPost;

  if (token && !isPublic) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
