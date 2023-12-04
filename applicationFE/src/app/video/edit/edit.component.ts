import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  showAlert = false;
  alertMessage = 'Please wait! Updating clip.';
  alertColor = 'blue';
  inSubmission = false;

  clipID = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit() {
    this.modal.register('editClip');
  }

  ngOnDestroy() {
    this.modal.unregistered('editClip');
  }

  ngOnChanges() {
    if (!this.activeClip) {
      return;
    }

    const docID = this.activeClip.docID;
    if (docID !== undefined) {
      this.clipID.setValue(docID);
    }

    this.title.setValue(this.activeClip.title);
  }

  async submit() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = 'Something went wrong. Please try again later!';
      return;
    }

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Succes!';
  }
}
