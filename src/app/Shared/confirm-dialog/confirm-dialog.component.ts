//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit,Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  dialogData: DialogData;
  title:string;
  message:string;

  constructor(public bsModalRef: BsModalRef) { }
// public dialogRef: MatDialogRef<ConfirmDialogComponent>,
// @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    // this.dialogRef.close(true);
    if(this.bsModalRef.content.callback != null) {
      this.bsModalRef.content.callback('yes');
      this.bsModalRef.hide();
    }
  }

  onDismiss(): void {
    // Close the dialog, return false
    // this.dialogRef.close(false);
    if(this.bsModalRef.content.callback != null) {
      this.bsModalRef.content.callback('no');
      this.bsModalRef.hide();
    }
  }
}
