
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
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    
    return { stream, error: null };
  } catch (error: any) {
    console.error("Error accessing camera:", error);
    return { 
      stream: null, 
      error: error.message || "Failed to access camera" 
    };
  }
}

export function stopCameraStream(stream: MediaStream | null) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

export function captureImageFromVideo(
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
): string | null {
  if (!videoRef.current || !canvasRef.current) return null;
  
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  
  if (!context) return null;
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/png');
}
