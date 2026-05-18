export enum TipoOcorrencia {
  ASSEDIO_MORAL = 'ASSEDIO_MORAL',
  ASSEDIO_SEXUAL = 'ASSEDIO_SEXUAL',
  DISCRIMINACAO = 'DISCRIMINACAO',
  VIOLENCIA_PSICOLOGICA = 'VIOLENCIA_PSICOLOGICA',
  RISCO_PSICOSSOCIAL = 'RISCO_PSICOSSOCIAL',
  OUTROS = 'OUTROS'
}

export enum StatusOcorrencia {
  RECEBIDA = 'RECEBIDA',
  EM_TRIAGEM = 'EM_TRIAGEM',
  EM_INVESTIGACAO = 'EM_INVESTIGACAO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export enum Role {
  TRIAGEM = 'TRIAGEM',
  RH = 'RH',
  COMPLIANCE = 'COMPLIANCE',
  DIRETORIA = 'DIRETORIA',
  ADMIN = 'ADMIN'
}

export interface OcorrenciaRequest {
  tipo: TipoOcorrencia;
  relato: string;
  anonima: boolean;
  setorRelacionado?: string;
  dataOcorrencia?: string;
}

export interface OcorrenciaResponse {
  id: string;
  protocolo: string;
  tipo: TipoOcorrencia;
  relato: string;
  setorRelacionado?: string;
  status: StatusOcorrencia;
  observacao?: string;
  anonima: boolean;
  dataCriacao: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
}

export interface User {
  name: string;
  email: string;
  role: Role;
}

export interface AnexoResponse {
  id: string;
  nomeArquivo: string;
  nomeOriginal?: string;
  tamanho: number;
  tipoArquivo: string;
  hashArquivo: string;
  dataUpload: string;
}

export interface AuditoriaResponse {
  id: string;
  dataEvento: string;
  usuario: string;
  emailUsuario?: string;
  tipo: string;
  ip: string;
  origem: string;
  descricao: string;
  statusAnterior?: StatusOcorrencia;
  statusNovo?: StatusOcorrencia;
}

export interface AnexoUploadResponse {
  id: string;
  nomeArquivo: string;
  message: string;
}
