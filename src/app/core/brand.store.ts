import { Injectable, signal } from '@angular/core';
import { Brand } from './brand.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsStore {
  brands = signal<Brand[]>([]);

  private apiUrl = `${environment.apiUrl}/brands`;

  constructor(private http: HttpClient) {}

  loadBrands(forceReload: boolean = false): Observable<Brand[]> {
    if (!forceReload && this.brands().length > 0) {
      return of(this.brands());
    }
    return this.http.get<Brand[]>(this.apiUrl).pipe(
      tap((data) => {
        this.brands.set(data);
      })
    );
  }
}
