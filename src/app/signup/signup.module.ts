import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { RecaptchaModule } from 'ng-recaptcha';
import { SafeURLPipe } from './pipes/safeURL.pipe';
import { PreloaderDialogComponent } from './preloader-dialog/preloader-dialog.component';
import { CountryStateFetcherService } from './services/country-state-fetcher.service';
import { PreloaderDialogService } from './services/preloader-dialog.service';
import { TosService } from './services/tos.service';
import { UserService } from './services/user.service';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { TosDialogComponent } from './tos-dialog/tos-dialog.component';

@NgModule({
  declarations: [SignupComponent, TosDialogComponent, SafeURLPipe, PreloaderDialogComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    MatInputModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    RecaptchaModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [UserService, CountryStateFetcherService, TosService, PreloaderDialogService],
})
export class SignupModule {}
