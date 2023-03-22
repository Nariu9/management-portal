import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [CommonModule, ResetPasswordRoutingModule],
})
export class ResetPasswordModule {}
