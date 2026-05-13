import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Role } from '../models/compliance.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TokenService', ['saveToken', 'getToken', 'removeToken', 'getRole']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and save token', () => {
    const mockResponse = { accessToken: 'fake-jwt', expiresIn: 3600 };
    const credentials = { email: 'test@test.com', password: 'password' };

    service.login(credentials).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(tokenServiceSpy.saveToken).toHaveBeenCalledWith('fake-jwt');
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return true for hasRole if user has role', () => {
    tokenServiceSpy.getRole.and.returnValue(Role.ADMIN);
    expect(service.hasRole([Role.ADMIN])).toBeTrue();
    expect(service.hasRole([Role.RH])).toBeFalse();
  });
});
