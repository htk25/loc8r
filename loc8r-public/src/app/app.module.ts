import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
//import { AppComponent } from './app.component';
import { HomeListComponent } from './home-list/home-list.component';
import { DistancePipe } from './distance.pipe';


@NgModule({
  declarations: [
    //AppComponent,
    
    HomeListComponent,
    DistancePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{ provide: APP_BASE_HREF, useValue : '/' }],
  bootstrap: [HomeListComponent]
})
export class AppModule { }
