import { Component } from '@angular/core';
import { CameraPreview } from '@capacitor-community/camera-preview';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isCameraActive = false;
  cameraState = 'Standby';
  barProgress = 0;
  isPhotoValid = false;

  constructor() {
    this.openCamera();
  }

  openCamera() {
    const cameraPreviewSettings = {
      parent: "cameraPreview",
      disableAudio: true,   // Don't ask permission for microphone access
      position: 'front',
      className: 'cameraPreview',
      toBack: true    // Allows to have HTML elements on top of the camera
    };

    CameraPreview.start(cameraPreviewSettings);
    this.isCameraActive = true;
  }

  async closeCamera() {
    await CameraPreview.stop();
    this.isCameraActive = false;
  }

  async takeSample() {
    // Add scan animation class
    const container = document.getElementById('image-container')!;
    container.classList.add('scanning');
    this.cameraState = 'Scanning';

    setInterval(() => {
      if (this.barProgress < 1) {
        this.barProgress += 0.01
      }
    }, 200);

    const CameraSampleOptions = {
      quality: 85  // Indicates the compression level, it goes from 0 (max compression) to 100
    };

    // Captures a sample image from the video stream. This can be used to perform real-time analysis on the current frame in the video.
    const result = await CameraPreview.captureSample(CameraSampleOptions);
    const base64Picture = result.value;

    // Simulate successfull call
    setTimeout(() => {
      this.barProgress = 1;
      setTimeout(() => {
        const container = document.getElementById('image-container')!;
        container.classList.remove('scanning');
        this.closeCamera();
        this.isPhotoValid = true;
      }, 500);
    }, 5000);

    // Simulate unsuccessfull call
    /* setTimeout(() => {
      this.barProgress = 1;
      const container = document.getElementById('image-container')!;
      container.classList.remove('scanning');
      this.cameraState = 'Error';
    }, 5000); */

  }

  retry() {
    this.cameraState = 'Standby';
    this.barProgress = 0;
  }

  // Se la fotocamera non è visibile, ho risolto cancellando la media query "prefers-color-scheme: dark" da variables.scss
  // Soluzione trovata qua: https://github.com/capacitor-community/camera-preview/issues/199
}
