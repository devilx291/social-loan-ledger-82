
/**
 * Camera utility functions for selfie capture and related operations
 */

type SetupCameraResult = {
  stream?: MediaStream;
  error?: string;
};

/**
 * Sets up the camera and starts streaming video to the provided element
 */
export const setupCamera = async (
  videoRef: React.RefObject<HTMLVideoElement>
): Promise<SetupCameraResult> => {
  try {
    if (!videoRef.current) {
      console.error("Video element reference not found");
      return { error: "Video element not found" };
    }

    console.log("Requesting media devices...");
    // Check if the browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { error: "Your browser doesn't support camera access" };
    }

    // Get user media with appropriate constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user", // Front camera
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    if (!stream) {
      return { error: "Failed to get camera stream" };
    }

    // Assign the stream to the video element
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.srcObject = stream;
      // Wait for the video to be loaded
      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play().then(() => resolve());
        };
      });
      
      console.log("Camera setup complete, video should be playing");
      return { stream };
    } else {
      stopCameraStream(stream);
      return { error: "Video element is no longer available" };
    }
  } catch (error: any) {
    console.error("Camera setup error:", error);
    
    // Handle permission errors specifically
    if (error.name === "NotAllowedError") {
      return { error: "Camera permission denied. Please allow camera access and try again." };
    }
    
    // Handle other specific errors
    if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      return { error: "No camera found on this device" };
    }
    
    if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      return { error: "Camera is in use by another application" };
    }
    
    // Generic error
    return { error: `Failed to access camera: ${error.message || "Unknown error"}` };
  }
};

/**
 * Stops the camera stream
 */
export const stopCameraStream = (stream: MediaStream | null) => {
  if (!stream) return;
  
  try {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    console.log("Camera stream stopped");
  } catch (error) {
    console.error("Error stopping camera stream:", error);
  }
};

/**
 * Captures an image from the video stream and returns it as a base64 data URL
 */
export const captureImageFromVideo = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
): string | null => {
  try {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error("Video or canvas element not found");
      return null;
    }
    
    // Set canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get 2D context from canvas");
      return null;
    }
    
    // Flip horizontally to create a mirror image effect
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    // Draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Get the image as data URL
    return canvas.toDataURL("image/jpeg", 0.92);
  } catch (error) {
    console.error("Error capturing image:", error);
    return null;
  }
};
