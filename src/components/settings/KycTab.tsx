
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, UserCheck, Loader2, AlertTriangle } from "lucide-react";
import { useSelfieCapture } from "@/hooks/useSelfieCapture";

export const KycTab = () => {
  const {
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
  } = useSelfieCapture();

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
        <CardDescription>
          Complete your identity verification to increase your trust score and access more features
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {verificationMessage && (
          <Alert className={selfieStatus === "verified" ? "bg-green-50 border-green-200" : selfieStatus === "rejected" ? "bg-red-50 border-red-200" : ""}>
            <AlertTitle>
              {selfieStatus === "verified" ? "Verification successful" : "Verification failed"}
            </AlertTitle>
            <AlertDescription>{verificationMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Selfie Verification</h3>
          <p className="text-sm text-muted-foreground">
            Take a clear selfie to verify your identity. Make sure you're in a well-lit environment and your face is clearly visible.
          </p>
          
          <div className="border rounded-lg p-4">
            {cameraError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Camera Error</AlertTitle>
                <AlertDescription>{cameraError}</AlertDescription>
              </Alert>
            )}
            
            {showCamera ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md mb-4">
                  <video 
                    ref={videoRef} 
                    className="w-full h-auto rounded-lg border border-gray-200"
                    autoPlay 
                    playsInline 
                    muted
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-dashed border-white w-64 h-64 rounded-full opacity-50"></div>
                  </div>
                </div>
                <Button onClick={captureSelfie}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Selfie
                </Button>
              </div>
            ) : selfieImage ? (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md mb-4">
                  <img 
                    src={selfieImage} 
                    alt="Your selfie" 
                    className="w-full h-auto rounded-lg border border-gray-200" 
                  />
                </div>
                <div className="flex space-x-3">
                  <Button onClick={retakeSelfie} variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Retake
                  </Button>
                  <Button 
                    onClick={handleVerifySelfie} 
                    disabled={capturingSelfie || selfieStatus === "verified"}
                  >
                    {capturingSelfie ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : selfieStatus === "verified" ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-2" />
                    )}
                    {selfieStatus === "verified" ? "Verified" : "Verify Identity"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <Camera className="h-10 w-10 text-gray-500" />
                </div>
                <h4 className="text-lg font-medium mb-2">Take a selfie</h4>
                <p className="text-sm text-center text-muted-foreground mb-4 max-w-md">
                  Your selfie will be securely stored and used only for identity verification purposes
                </p>
                <Button onClick={startCamera}>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 mb-2">Why complete KYC verification?</h4>
          <ul className="text-sm space-y-1 text-blue-600">
            <li>• Increases your trust score by 20 points</li>
            <li>• Adds a verified badge to your profile</li>
            <li>• Unlock higher borrowing limits</li>
            <li>• Faster loan approvals</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
