import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '../../node_modules/@angular/platform-browser/animations';

import { HttpClient, HttpClientModule } from '../../node_modules/@angular/common/http';

import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import { CloudinaryConfiguration, CloudinaryModule } from '../../node_modules/@cloudinary/angular-5.x';

import cloudinaryConfiguration from './config';
export const cloudinary = {
  Cloudinary: CloudinaryCore
};
export const config: CloudinaryConfiguration = cloudinaryConfiguration;

import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { AppRoutingModule } from './/app-routing.module';
import { PendingChangesGuard } from './deactivate-guard';

import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { AppFooterComponent } from './app-footer/app-footer.component';

import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { CleanStringPipe } from './utils/clean-string.pipe';
import { KeysPipe } from './utils/keys.pipe';
import { ButtonComponent } from './button/button.component';
import { CdnImageComponent } from './cdn-image/cdn-image.component';
import { LoaderComponent } from './loader/loader.component';
import { GameComponent } from './game/game.component';
import { GameStartComponent } from './game/start/start.component';
import { GameCharacterComponent } from './game/character/character.component';
import { GameWelcomeComponent } from './game/welcome/welcome.component';
import { GameHomeComponent } from './game/home/home.component';
import { GameLocationComponent } from './game/location/location.component';
import { GameToolbarComponent } from './game/toolbar/toolbar.component';
import { GameEmblemComponent } from './game/emblem/emblem.component';
import { GameEventComponent } from './game/event/event.component';
import { RepeatEndDirective } from './utils/repeat-end.directive';
import { WellbeingComponent } from './wellbeing/wellbeing.component';
import { RemoveTagsPipe } from './utils/remove-tags.pipe';
import { TutorialComponent } from './game/tutorial/tutorial.component';
import { CardComponent } from './game/card/card.component';
import { DeviceactionPipe } from './utils/deviceaction.pipe';

const appRoutes: Routes = [
  { path: '', redirectTo: 'game', pathMatch: 'full' },
  { 
    path: 'game',
    component: GameComponent,
    children: [
      {path: '', redirectTo: 'start', pathMatch: 'full'}, 
      {path: 'start', component: GameStartComponent, data: {index: 0}}, 
      {path: 'welcome', component: GameWelcomeComponent}, 
      {path: 'home', canDeactivate: [PendingChangesGuard], component: GameHomeComponent}, 
      {path: 'location/:locationUrl', component: GameLocationComponent} 
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
    ButtonComponent,
    AboutComponent,
    CdnImageComponent,
    LoaderComponent,
    GameComponent,
    GameStartComponent,
    GameCharacterComponent,
    GameWelcomeComponent,
    GameHomeComponent,
    GameLocationComponent,
    GameToolbarComponent,
    GameEmblemComponent,
    GameEventComponent,
    
    CleanStringPipe,
    KeysPipe,
    RepeatEndDirective,
    WellbeingComponent,
    RemoveTagsPipe,
    TutorialComponent,
    CardComponent,
    DeviceactionPipe
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
    AppRoutingModule,
  ],
  exports: [
    RouterModule,
    LoaderComponent
  ],
  providers: [
    DataService,
    LoaderComponent,
    PendingChangesGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
