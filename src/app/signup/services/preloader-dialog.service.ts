import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PreloaderDialogComponent } from '../preloader-dialog/preloader-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class PreloaderDialogService {
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private dialog: MatDialog) {}

  openPreloaderDialog(): void {
    this.dialogRef = this.dialog.open(PreloaderDialogComponent, {
      disableClose: true,
    });
  }

  closePreloaderDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
