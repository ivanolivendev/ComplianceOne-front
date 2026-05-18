import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  // Rotas Públicas:
  // 1. Qualquer POST em ocorrencias ou anexos (Denúncia anônima)
  // 2. Qualquer GET de protocolo
  // 3. Qualquer rota de auth
  const isPublicPost = req.method === 'POST' && (req.url.includes('/ocorrencias') || req.url.includes('/anexos'));
  const isPublicGet = req.method === 'GET' && req.url.includes('/protocolo/');
  const isAuthRoute = req.url.includes('/api/v1/auth/');

  const isPublic = isPublicPost || isPublicGet || isAuthRoute;

  // Se tivermos token e NÃO for uma rota pública de denúncia, injetamos o token
  // Isso permite que o Dashboard (GET /ocorrencias) receba o token de Admin
  if (token && !isPublic) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
