import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CropImageComponent} from './crop-image/crop-image.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { LandingComponent } from './landing/landing.component';
import { ResizeImageComponent } from './resize-image/resize-image.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CompressImageComponent } from './compress-image/compress-image.component';

const routes: Routes = [
  { path: 'crop-image', component: CropImageComponent },
  { path: 'resize-image', component: ResizeImageComponent },
  { path: 'compress-jpg', component: CompressImageComponent },
  { path: '404', component: PageNotFoundComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: '', component: LandingComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
