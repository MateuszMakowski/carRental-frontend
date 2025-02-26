import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface AddressDialogData {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

@Component({
  selector: 'app-address-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './address-dialog.component.html',
  styleUrl: './address-dialog.component.scss',
})
export class AddressDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddressDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
