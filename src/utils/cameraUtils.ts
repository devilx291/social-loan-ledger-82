import { MutableRefObject } from 'react';

interface CameraSetupResult {
  stream: MediaStream | null;
  error: string | null;
}

export async function setupCamera(
  videoRef: MutableRefObject<HTMLVideoElement | null>
): Promise<CameraSetupResult> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { 
        stream: null, 
        error: "Your browser doesn't support camera access" 
      };
    }
    
    const constraints = { 
      video: { 
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    };
    
    console.log("Requesting camera access with constraints:", constraints);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("Camera access granted, stream obtained:", stream);
    
    // Make sure the videoRef is actually pointing to a mounted video element
    if (!videoRef.current) {
      console.error("Video element not found in DOM");
      return {
        stream,
        error: "Video element not found"
      };
    }
    
    // Set the stream to the video element
    videoRef.current.srcObject = stream;
    console.log("Stream assigned to video element");
    
    // Ensure the video loads properly
    return new Promise((resolve) => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Video is now playing");
                resolve({ stream, error: null });
              })
              .catch(err => {
                console.error("Error playing video:", err);
                resolve({ stream, error: "Failed to play video stream" });
              });
          }
        };
        
        // Add a timeout in case the metadata never loads
        setTimeout(() => {
          if (!videoRef.current!.paused) {
            console.log("Video is already playing");
            resolve({ stream, error: null });
          } else {
            console.error("Video metadata loading timeout");
            resolve({ stream, error: "Camera initialization timeout" });
          }
        }, 3000);
      } else {
        resolve({ stream, error: "Video element disappeared" });
      }
    });
  } catch (error: any) {
    console.error("Error accessing camera:", error);
    let errorMessage = "Failed to access camera";
    
    // Provide more specific error messages based on the error
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      errorMessage = "Camera access denied. Please allow camera permissions and try again.";
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      errorMessage = "No camera found on your device.";
    } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      errorMessage = "Camera is in use by another application.";
    } else if (error.name === "OverconstrainedError") {
      errorMessage = "Camera doesn't meet the required constraints.";
    } else if (error.name === "TypeError") {
      errorMessage = "Invalid constraints specified.";
    }
    
    return { 
      stream: null, 
      error: errorMessage
    };
  }
}

export function stopCameraStream(stream: MediaStream | null) {
  console.log("Stopping camera stream:", stream);
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
      console.log("Track stopped:", track.label);
    });
  }
}

export function captureImageFromVideo(
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
): string | null {
  if (!videoRef.current || !canvasRef.current) {
    console.warn("Video or canvas ref is null, cannot capture image");
    return null;
  }
  
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  
  if (!context) {
    console.warn("Could not get 2d context from canvas");
    return null;
  }
  
  // Check if the video has valid dimensions
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    console.warn("Video dimensions are invalid:", video.videoWidth, video.videoHeight);
    return null;
  }
  
  console.log("Capturing image from video with dimensions:", video.videoWidth, "x", video.videoHeight);
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const imageData = canvas.toDataURL('image/png');
  console.log("Image captured successfully");
  
  return imageData;
}
