
import { verifyDocument } from './documentService';
import { AuthUser } from './authService';

export async function verifySelfieImage(
  selfieImage: string, 
  userId: string
): Promise<{ 
  verified: boolean; 
  message?: string;
}> {
  try {
    const response = await fetch(selfieImage);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('document', blob, 'selfie.png');
    formData.append('type', 'selfie');
    formData.append('userId', userId);
    
    return await verifyDocument(formData);
  } catch (error: any) {
    console.error("Error verifying selfie:", error);
    throw error;
  }
}

export async function updateUserSelfie(
  updateUserFn: (updates: Partial<AuthUser>) => Promise<void>,
  user: AuthUser,
  selfieImage: string
): Promise<void> {
  try {
    await updateUserFn({
      ...user,
      trustScore: Math.min(100, user.trustScore + 20),
      isVerified: true,
      selfieImage: selfieImage
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
