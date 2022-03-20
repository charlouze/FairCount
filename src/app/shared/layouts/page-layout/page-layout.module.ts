import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageLayoutComponent, PageLayoutToolbarDirective } from './page-layout.component';

@NgModule({
  declarations: [
    PageLayoutComponent,
    PageLayoutToolbarDirective,
  ],
  exports: [
    PageLayoutComponent,
    PageLayoutToolbarDirective,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class PageLayoutModule {
}
