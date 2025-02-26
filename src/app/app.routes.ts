import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'vehicles',
    loadChildren: () =>
      import('./vehicles/wehicle.routes').then((m) => m.vehicleRoutes),
  },
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: '**', redirectTo: 'vehicles' },
];
