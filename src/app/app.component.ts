import {Component, OnDestroy} from '@angular/core';

import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import {Observable, Observer, Subject, Subscription} from "rxjs";
import {ImageService} from "./services/image.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  public videoOptions: MediaTrackConstraints={
    width: 1920,
    height: 1080
  };

  public errors: WebcamInitError[] =[];

  //latest screencapture
  public webcamImage: WebcamImage | undefined;
  public generatedImage: string | undefined;
  public imageFile: File | undefined;
  public imageHash: String | undefined;
  public sub: Subscription | undefined;
  public pleaseWait: Boolean = false;
  public isPreviewVisible: Boolean = true;
  public togglePreviewMessage: String = 'Preview activated';
  public pictureProcessed: Boolean = false;
  public message: String = '';
  public messageError: String = '';
  public showWebcam: Boolean = false;
  public isStartButtonVisible: Boolean = true;
  public showPicture: Boolean= false;

  constructor(private imageService: ImageService) {}

  //webcam screencapture trigger
  private trigger: Subject<void> = new Subject<void>();

  showPreview() {
    this.showWebcam = true;
    this.isStartButtonVisible = false;
  }

  save() {
    const popup = document.getElementById('info-popup');
    popup?.classList.remove('hidden');

    const message = document.getElementById('message');
    message?.classList.remove('hidden');

    const messageError = document.getElementById('messageError');
    messageError?.classList.remove('hidden');
  }

  reload() {
    this.showWebcam = true;
    this.pictureProcessed = false;
    this.showPicture = true;
  }

  public triggerSnapshot(): void{
    this.trigger.next();
    this.showWebcam = false;
    this.showPicture = false;

    const popup = document.getElementById('info-popup');
    popup?.classList.add('hidden');
  }

  public handlerInitError(error: WebcamInitError): void{
    this.errors.push(error);
    console.error('errors', this.errors);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.pictureProcessed = false;
    this.webcamImage = webcamImage;
    this.dataURItoBlob(webcamImage.imageAsBase64).subscribe({
      next: (blob) => {
        const imageBlob: Blob = blob;
        const imageName: string = `${Date.now()}.jpeg`;
        this.imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
      },
      error: (err) => {console.error(err)},
      complete: () => {console.log('completed')}
    });
      console.log('Webcam Image Received', webcamImage);
  }

  public get triggerObservable(): Observable<void>{
    return this.trigger.asObservable();
  }

  dataURItoBlob(dataURI: string): Observable<Blob> {
    return new Observable((observer: Observer<Blob>) => {
      const byteString: string =  window.atob(dataURI);
      const arrayBuffer: ArrayBuffer =  new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);

      for(let i=0; i<byteString.length; i++){
        int8Array[i]= byteString.charCodeAt(i);
      }

      const blob = new Blob([int8Array], {type: 'image/jpeg' });
      observer.next(blob);
      observer.complete();
    });
  }

  upload(){
    this.pleaseWait =  true;
    const formData = new FormData();
    formData.append('files', this.imageFile!,  this.imageFile?.name);
    this.sub = this.imageService.uploadImage(formData).subscribe({
      next: (data) => {
        this.pleaseWait = false;
        this.imageHash = data[0].hash;
        this.pictureProcessed = true;
        this.message = 'Screenshot saved'
        this.showMessage({duration: 2000});

        console.log('AppComponent => upload => data', data);
      },
      error: (err) => {
        this.pleaseWait = false;
        this.pictureProcessed = true;
        this.messageError = 'Screenshot not saved. An error occured.'
        this.showMessage({duration: 2000});

        console.error('AppComponent => upload => err', err);
      },
      complete: () => {
        this.pleaseWait = false;
        this.pictureProcessed = true;
        console.log('completed');
      }
    });
  }

  togglePreviewVisibility(){
    this.isPreviewVisible = !this.isPreviewVisible;
    this.togglePreviewMessage = this.isPreviewVisible ? 'Preview enabled' : 'Preview disabled';
  }

  showMessage(options){
    setTimeout(() => {
      this.message = ' ';
      this.messageError = ' ';

      const message = document.getElementById('message');
      message?.classList.add('hidden');

      const messageError = document.getElementById('messageError');
      messageError?.classList.add('hidden');

    }, options.duration);
  }

  ngOnDestroy(){
    this.sub?.unsubscribe();
  }
}
