import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent, PageLayoutToolbarDirective } from './page-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';


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
  ],
})
export class PageLayoutModule {
}
