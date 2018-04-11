import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import { CloudinaryConfiguration, CloudinaryModule } from '@cloudinary/angular-5.x';

import cloudinaryConfiguration from './config';
export const cloudinary = {
  Cloudinary: CloudinaryCore
};
export const config: CloudinaryConfiguration = cloudinaryConfiguration;

import { AppComponent } from './app.component';
import { JsonService } from './json.service';
import { AppRoutingModule } from './/app-routing.module';

import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { AppFooterComponent } from './app-footer/app-footer.component';

import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { CleanStringPipe } from './utils/clean-string.pipe';
import { ButtonComponent } from './button/button.component';
import { CdnImageComponent } from './cdn-image/cdn-image.component';
import { LoaderComponent } from './loader/loader.component';
import { GameComponent } from './game/game.component';
import { GameStartComponent } from './game/start/start.component';
import { GameCharacterComponent } from './game/character/character.component';

const appRoutes: Routes = [
  { 
    path: 'game',
    component: GameComponent,
    children: [
      {path: '', redirectTo: 'start', pathMatch: 'full'}, 
      {path: 'start', component: GameStartComponent}, 
      {path: 'character', component: GameCharacterComponent}, 
    ]
  },
  { path: 'about', component: AboutComponent },
  { path: '**', component: HomepageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    AppFooterComponent,
    HomepageComponent,
    CleanStringPipe,
    ButtonComponent,
    AboutComponent,
    CdnImageComponent,
    LoaderComponent,
    GameComponent,
    GameStartComponent,
    GameCharacterComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    CloudinaryModule.forRoot(cloudinary, config),
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  exports: [
    RouterModule,
    LoaderComponent
  ],
  providers: [
    JsonService,
    LoaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
