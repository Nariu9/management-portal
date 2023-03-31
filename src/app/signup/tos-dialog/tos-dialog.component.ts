import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mp-tos-dialog',
  templateUrl: './tos-dialog.component.html',
  styleUrls: ['./tos-dialog.component.scss'],
})
export class TosDialogComponent implements OnInit, OnDestroy {
  messageListener: ((event: MessageEvent) => void) | undefined;
  isSigned = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) {}

  ngOnInit(): void {
    // handling Pandadoc events
    this.messageListener = (event: MessageEvent) => {
      const type = event.data && event.data.type;
      if (type === 'session_view.document.completed') {
        this.isSigned = true;
      }
    };
    window.addEventListener('message', this.messageListener);
  }

  ngOnDestroy(): void {
    this.messageListener && window.removeEventListener('message', this.messageListener);
  }
}
