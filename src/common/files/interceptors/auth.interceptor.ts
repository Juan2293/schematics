import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

  export function authInterceptor (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
   
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(cloned);
    }
    return next(req);
  }

