import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

export class AuthInterceptor implements HttpInterceptor{

  intercept(req: HttpRequest<any>, next: HttpHandler  ){

    const authRequest= req.clone({
      // headers: req.headers.set("Authorization", authToken)
    })

    return next.handle(authRequest)

  }
}
