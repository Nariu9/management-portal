import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';

@NgModule({
  declarations: [SignupComponent],
  imports: [CommonModule, SignupRoutingModule],
})
export class SignupModule {}
