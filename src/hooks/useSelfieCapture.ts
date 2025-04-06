
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    
    try {
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
      
      if (stream && videoRef.current) {
        streamRef.current = stream;
        setShowCamera(true);
        
        // Add this check to ensure video has loaded metadata before playing
        if (videoRef.current.readyState >= 2) {
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
            setCameraError("Failed to start camera stream");
          });
        } else {
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(err => {
                console.error("Error playing video:", err);
                setCameraError("Failed to start camera stream");
              });
            }
          };
        }
      }
    } catch (err) {
      console.error("Unexpected error starting camera:", err);
      setCameraError("An unexpected error occurred while accessing the camera");
    }
  };

  const captureSelfie = () => {
    const imageData = captureImageFromVideo(videoRef, canvasRef);
    if (imageData) {
      setSelfieImage(imageData);
      
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
        streamRef.current = null;
      }
      setShowCamera(false);
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
    videoRef,
    canvasRef,
    verificationMessage,
    cameraError,
    startCamera,
    captureSelfie,
    handleVerifySelfie,
    retakeSelfie,
    uploadSelfie
  };
}
