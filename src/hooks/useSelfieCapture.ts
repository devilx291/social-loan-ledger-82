
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { verifyDocument } from "@/services/documentService";

export function useSelfieCapture() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [showCamera, setShowCamera] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [selfieStatus, setSelfieStatus] = useState<"idle" | "verified" | "rejected">("idle");
  const [capturingSelfie, setCapturingSelfie] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream when component unmounts or camera is hidden
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Stop camera when showCamera changes to false
  useEffect(() => {
    if (!showCamera && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [showCamera]);

  useEffect(() => {
    // Check if user is already verified and has a selfie image
    if (user?.isVerified) {
      setSelfieStatus("verified");
      if (user?.selfieImage) {
        setSelfieImage(user.selfieImage);
      }
    }
  }, [user]);

  // Start camera for selfie KYC
  const startCamera = async () => {
    try {
      setCameraError(null);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
          streamRef.current = stream;
          setShowCamera(true);
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(err => {
                console.error("Error playing video:", err);
                setCameraError("Failed to start camera stream");
              });
            }
          };
        }
      } else {
        setCameraError("Your browser doesn't support camera access");
        toast({
          title: "Camera access failed",
          description: "Your browser doesn't support camera access or permission was denied.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      setCameraError(error.message || "Failed to access camera");
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to complete KYC verification.",
        variant: "destructive",
      });
    }
  };

  // Capture selfie from camera
  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL (PNG format)
        const imageData = canvas.toDataURL('image/png');
        setSelfieImage(imageData);
        
        // Stop the camera after capturing
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setShowCamera(false);
      }
    }
  };

  // Verify selfie for KYC
  const handleVerifySelfie = async () => {
    if (!selfieImage || !user) return;
    
    setCapturingSelfie(true);
    
    try {
      // Convert base64 to blob for FormData
      const response = await fetch(selfieImage);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('document', blob, 'selfie.png');
      formData.append('type', 'selfie');
      formData.append('userId', user.id);
      
      const result = await verifyDocument(formData);
      
      if (result.verified) {
        setSelfieStatus("verified");
        setVerificationMessage("Selfie verification successful. Your account is now verified.");
        
        // Update user trust score and verification status
        await updateUser({
          ...user,
          trustScore: Math.min(100, user.trustScore + 20),
          isVerified: true,
          selfieImage: selfieImage
        });
        
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

  // Reset selfie and restart camera
  const retakeSelfie = () => {
    setSelfieImage(null);
    setSelfieStatus("idle");
    startCamera();
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
    retakeSelfie
  };
}
