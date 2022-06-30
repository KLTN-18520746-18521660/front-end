import { AppUserComponent } from 'pages/AppUser/AppUser.component';
import { UserService } from 'services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Input, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Header, MessageService, PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import Quill from "quill";
import { PostsService } from 'services/posts.service';

import ImageResize from 'quill-image-resize-module';
import VideoResize from 'quill-video-resize-module';
import QuillImageDropAndPaste, { ImageData as QuillImageData } from 'quill-image-drop-and-paste';

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/videoResize', VideoResize);
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);

export const EDITOR_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditorComponent),
  multi: true
};

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  providers: [EDITOR_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'p-element'
  }
})
export class EditorComponent implements AfterViewInit, AfterContentInit, ControlValueAccessor {

  @Output() onTextChange: EventEmitter<any> = new EventEmitter();

  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();

  @ContentChild(Header) toolbar: any;

  @Input() style: any;

  @Input() styleClass: string;

  @Input() placeholder: string;

  @Input() formats: string[];

  @Input() modules: any;

  @Input() bounds: any;

  @Input() scrollingContainer: any;

  @Input() debug: string;

  @Output() onInit: EventEmitter<any> = new EventEmitter();

  @ContentChildren(PrimeTemplate) templates: QueryList<any>;

  value: string;

  _readonly: boolean;

  onModelChange: Function = () => { };

  onModelTouched: Function = () => { };

  quill: Quill;

  headerTemplate: TemplateRef<any>;

  uploadSubscription: Subscription;

  constructor(
    public el: ElementRef,
    private postService: PostsService,
    private userService: UserService,
    private messageService: MessageService,
    private translate: TranslateService,
    private appUser: AppUserComponent
  ) { }

  ngAfterViewInit() {
    let editorElement = DomHandler.findSingle(this.el.nativeElement, 'div.p-editor-content');
    let toolbarElement = DomHandler.findSingle(this.el.nativeElement, 'div.p-editor-toolbar');
    let defaultModule = { toolbar: toolbarElement };
    let modules = this.modules ? { ...defaultModule, ...this.modules } : defaultModule;

    this.quill = new Quill(editorElement, {
      modules: {
        ...modules,
        imageResize: {
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        videoResize: {
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        imageDropAndPaste: {
          handler: this.imageHandler.bind(this),
        },
      },
      placeholder: this.placeholder,
      readOnly: this.readonly,
      theme: 'snow',
      formats: this.formats,
      bounds: this.bounds,
      debug: this.debug,
      scrollingContainer: this.scrollingContainer,
    });

    let toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
      if (!this.userService.getSessionId()) {
        this.appUser.openLoginPopup();
        return;
      }
      // Add a file input element to the document, then click it (open file).
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', '.png, .jpg, .jpeg, .svg, .webp');
      input.click();

      // Once file is selected.
      input.onchange = () => {
        const file = input.files[0];

        // Validate file type is an image.
        if (/^image\//.test(file.type)) {
          this.uploadImage(file);
        }

        // Not an image.
        else {
          console.warn('You could only upload images.');
        }
      };
    });

    if (this.value) {
      this.quill.setContents(this.quill.clipboard.convert({ html: this.value }));
    }

    this.quill.on('text-change', (delta, oldContents, source) => {
      if (source === 'user') {
        let html = DomHandler.findSingle(editorElement, '.ql-editor').innerHTML;
        let text = this.quill.getText().trim();
        if (html === '<p><br></p>') {
          html = null;
        }

        this.onTextChange.emit({
          htmlValue: html,
          textValue: text,
          delta: delta,
          source: source
        });

        this.onModelChange(html);
        this.onModelTouched();
      }
    });

    this.quill.on('selection-change', (range, oldRange, source) => {
      this.onSelectionChange.emit({
        range: range,
        oldRange: oldRange,
        source: source
      });
    });

    this.onInit.emit({
      editor: this.quill
    });
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'header':
          this.headerTemplate = item.template;
          break;
      }
    });
  }

  imageHandler(dataUrl: string, type: string, imageData: QuillImageData) {
    if (!this.userService.getSessionId()) {
      this.appUser.openLoginPopup();
      return;
    }
    const file = imageData.toFile();

    this.uploadImage(file);
  }

  uploadImage(file: File) {
    this.messageService.add({
      key: 'editor',
      severity: 'info',
      summary: '',
      detail: this.translate.instant('message.uploading'),
      life: 3000
    });

    this.uploadSubscription = this.postService.upLoadImage('post', file).subscribe(
      (res) => {
        // Insert image into the editor.
        const url = res.data.url;

        // Get the current cursor position.
        const range = this.quill.getSelection();

        // Insert the image at the current cursor position.
        // Delta is defined in the Quill API: https://quilljs.com/guides/designing-the-delta-format/
        let delta: any = {
          ops: [
            {
              retain: range.index,
            },
            {
              insert: {
                image: url
              }
            },
            {
              insert: "\n"
            }
          ]
        }
        console.log(this.quill.insertEmbed(range.index, 'image', url));
        this.quill.updateContents(delta, 'user');

        // Focus on editor.
        this.quill.focus();

        // Move the cursor past the image.
        this.quill.setSelection({
          index: range.index + 1,
          length: range.length
        });

        // Show a success message.
        this.messageService.add({
          key: 'editor',
          severity: 'success',
          summary: '',
          detail: this.translate.instant('message.uploadsucess'),
          life: 4000
        });
      },
      (err) => {
        this.messageService.add({ key: 'editor', severity: 'error', summary: '', detail: this.translate.instant(`messageCode.${err.message_code}`) });
      }
    );
  }

  writeValue(value: any): void {
    this.value = value;

    if (this.quill) {
      if (value)
        this.quill.setContents(this.quill.clipboard.convert(value));
      else
        this.quill.setText('');
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  getQuill() {
    return this.quill;
  }

  @Input() get readonly(): boolean {
    return this._readonly;
  }

  set readonly(val: boolean) {
    this._readonly = val;

    if (this.quill) {
      if (this._readonly)
        this.quill.disable();
      else
        this.quill.enable();
    }
  }

  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }
}