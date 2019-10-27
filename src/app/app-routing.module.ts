import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CropImageComponent} from './crop-image/crop-image.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'crop-image', component: CropImageComponent },
  { path: '404', component: PageNotFoundComponent},
  { path: '', component: CropImageComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
