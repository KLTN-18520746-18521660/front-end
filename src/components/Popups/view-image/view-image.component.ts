import { Component, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { DomHandler } from 'primeng/dom';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent implements OnChanges {

  @Input() src: string = '';

  @Input() visible: boolean = true;

  @Output() onHide: EventEmitter<any> = new EventEmitter();

  rotate: number = 0;

  scale: number = 1;

  previewClick: boolean = false;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closePreview();
    }
  }

  constructor() { }

  ngOnChanges() {
    if (this.visible) {
      DomHandler.addClass(document.body, 'p-overflow-hidden');
    }
    else {
      DomHandler.removeClass(document.body, 'p-overflow-hidden');
    }
  }

  public get isZoomOutDisabled(): boolean {
    return this.scale - this.zoomSettings.step <= this.zoomSettings.min;
  }

  public get isZoomInDisabled(): boolean {
    return this.scale + this.zoomSettings.step >= this.zoomSettings.max;
  }

  private zoomSettings = {
    default: 1,
    step: 0.1,
    max: 2,
    min: 0.5
  }

  onWheel(event) {
    this.previewClick = true;

    if (event.deltaY < 0) {
      this.zoomIn();
    }
    else {
      this.zoomOut();
    }
  }

  rotateRight() {
    this.rotate += 90;
    this.previewClick = true;
  }

  rotateLeft() {
    this.rotate -= 90;
    this.previewClick = true;
  }

  zoomIn() {
    this.scale = this.scale + this.zoomSettings.step;
    this.previewClick = true;
  }

  zoomOut() {
    this.scale = this.scale - this.zoomSettings.step;
    this.previewClick = true;
  }

  closePreview(): void {
    this.rotate = 0;
    this.scale = this.zoomSettings.default;
    this.previewClick = false;
    this.onHide.emit();
  }

  imagePreviewStyle() {
    return { transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')' };
  }

  onMaskClick() {
    if (!this.previewClick) {
      this.closePreview();
    }

    this.previewClick = false;
  }

  handleToolbarClick(event: MouseEvent): void {
    event.stopPropagation();
  }

}
