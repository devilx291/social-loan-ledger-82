
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { setupCamera, stopCameraStream, captureImageFromVideo } from '@/utils/cameraUtils';
import { verifySelfieImage, updateUserSelfie } from '@/services/selfieVerificationService';

type SelfieStatus = "idle" | "verified" | "rejected";

export function useSelfieCapture() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [showCamera, setShowCamera] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [selfieStatus, setSelfieStatus] = useState<SelfieStatus>("idle");
  const [capturingSelfie, setCapturingSelfie] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  // Stop camera stream when camera is hidden
  useEffect(() => {
    if (!showCamera && streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
      setIsCameraReady(false);
    }
  }, [showCamera]);

  // Set verification status based on user data
  useEffect(() => {
    if (user?.isVerified) {
      setSelfieStatus("verified");
      if (user?.selfieImage) {
        setSelfieImage(user.selfieImage);
      }
    }
  }, [user]);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraReady(false);
    
    // Show the camera UI first
    setShowCamera(true);
  };

  // Create a separate effect to handle camera initialization after showCamera changes
  useEffect(() => {
    if (showCamera) {
      const initializeCamera = async () => {
        // Small delay to ensure the DOM is fully updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          if (!videoRef.current) {
            setCameraError("Video element not initialized. Please try again.");
            return;
          }
          
          const { stream, error } = await setupCamera(videoRef);
          
          if (error) {
            setCameraError(error);
            toast({
              title: "Camera access failed",
              description: error,
              variant: "destructive",
            });
            return;
          }
          
          if (stream) {
            streamRef.current = stream;
            setIsCameraReady(true);
            console.log("Camera started successfully");
          }
        } catch (err) {
          console.error("Unexpected error starting camera:", err);
          setCameraError("An unexpected error occurred while accessing the camera");
        }
      };
      
      initializeCamera();
    }
  }, [showCamera, toast]);

  const stopCamera = () => {
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsCameraReady(false);
  };

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) {
      setCameraError("Cannot capture image. Video not initialized.");
      return;
    }

    const imageData = captureImageFromVideo(videoRef, canvasRef);
    if (imageData) {
      setSelfieImage(imageData);
      stopCamera();
    } else {
      setCameraError("Failed to capture image. Please try again.");
    }
  };

  const handleVerifySelfie = async () => {
    if (!selfieImage || !user) return;
    
    setCapturingSelfie(true);
    
    try {
      const result = await verifySelfieImage(selfieImage, user.id);
      
      if (result.verified) {
        setSelfieStatus("verified");
        setVerificationMessage("Selfie verification successful. Your account is now verified.");
        
        await updateUserSelfie(updateUser, user, selfieImage);
        
        toast({
          title: "KYC completed",
          description: "Your identity has been verified successfully.",
          duration: 5000,
        });
      } else {
        setSelfieStatus("rejected");
        setVerificationMessage("Selfie verification failed. Please try again with better lighting and a clear face image.");
        
        toast({
          title: "Verification failed",
          description: result.message || "We couldn't verify your identity. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error verifying selfie:", error);
      toast({
        title: "Verification error",
        description: error.message || "There was an error verifying your identity.",
        variant: "destructive",
      });
    } finally {
      setCapturingSelfie(false);
    }
  };

  const retakeSelfie = () => {
    setSelfieImage(null);
    setSelfieStatus("idle");
    startCamera();
  };

  const uploadSelfie = async (base64Image: string) => {
    try {
      if (user) {
        await updateUser({
          selfieImage: base64Image
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return {
    showCamera,
    selfieImage,
    selfieStatus,
    capturingSelfie,
    isCameraReady,
    videoRef,
    canvasRef,
    verificationMessage,
    cameraError,
    startCamera,
    stopCamera,
    captureSelfie,
    handleVerifySelfie,
    retakeSelfie,
    uploadSelfie
  };
}
