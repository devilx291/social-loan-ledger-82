
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  name: string;
  phoneNumber: string; // This will store email
  trustScore: number;
  isVerified?: boolean;
  selfieImage?: string | null; // Add selfieImage property
  mobileNumber?: string | null; // Add mobile number property
};

export const signUp = async (email: string, name: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// New function to send OTP to mobile
export const sendMobileOTP = async (mobileNumber: string) => {
  // In a real implementation, this would use a provider like Twilio
  // For demo purposes, we'll simulate OTP generation
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: mobileNumber,
  });

  if (error) throw error;
  return data;
};

// New function to verify OTP
export const verifyMobileOTP = async (mobileNumber: string, otp: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: mobileNumber,
    token: otp,
    type: 'sms',
  });

  if (error) throw error;
  return data;
};

// Function to update mobile number in profile
export const updateMobileNumber = async (userId: string, mobileNumber: string): Promise<boolean> => {
  try {
    // Using typed parameters for RPC call
    const { data, error } = await supabase.rpc('verify_mobile_number', {
      user_id: userId,
      phone_number: mobileNumber
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating mobile number:", error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Fetch the profile data from the profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error("Error fetching profile:", error);
    // Fallback to user metadata if profile fetch fails
    return {
      id: user.id,
      name: user.user_metadata?.name || 'User',
      phoneNumber: user.email || '',
      trustScore: 50,
      isVerified: false,
      selfieImage: null,
      mobileNumber: null,
    };
  }
  
  // Check for is_verified property using hasOwnProperty to avoid TypeScript errors
  // This handles the case where the is_verified column doesn't exist yet in profiles table
  const isVerified = Object.prototype.hasOwnProperty.call(profile, 'is_verified') ? 
    (profile as any).is_verified : false;
  
  // Get selfie image from profile
  const selfieImage = Object.prototype.hasOwnProperty.call(profile, 'selfie_image') ? 
    (profile as any).selfie_image : null;
  
  // Get mobile number from profile  
  const mobileNumber = Object.prototype.hasOwnProperty.call(profile, 'mobile_number') ? 
    (profile as any).mobile_number : null;
  
  return {
    id: user.id,
    name: profile.name || user.user_metadata?.name || 'User',
    phoneNumber: user.email || '',
    trustScore: profile.trust_score || 50,
    isVerified: isVerified,
    selfieImage: selfieImage,
    mobileNumber: mobileNumber,
  };
};

export const updateUserProfile = async (userId: string, updates: Partial<AuthUser>) => {
  try {
    // Update auth user metadata if name is provided
    if (updates.name) {
      await supabase.auth.updateUser({
        data: {
          name: updates.name,
        }
      });
    }
    
    // Create update object with only fields that exist in the profiles table
    const profileUpdates: Record<string, any> = {};
    if (updates.name) profileUpdates.name = updates.name;
    if (updates.isVerified !== undefined) profileUpdates.is_verified = updates.isVerified;
    if (updates.selfieImage !== undefined) profileUpdates.selfie_image = updates.selfieImage;
    if (updates.mobileNumber !== undefined) profileUpdates.mobile_number = updates.mobileNumber;
    
    // Update profile in the profiles table
    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updateUserTrustScore = async (userId: string, trustScore: number) => {
  try {
    // First, make sure the score is within valid range
    const boundedScore = Math.max(0, Math.min(100, trustScore));
    
    // Call the RPC function to update trust score
    const { error } = await supabase.rpc('update_trust_score', {
      user_id: userId,
      score_change: boundedScore - 50 // Assuming 50 is the base score, adjust by difference
    });

    if (error) {
      console.error("Error updating trust score:", error);
      throw error;
    }
    
    // Verify the update by fetching the updated profile
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('trust_score')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching updated profile:", fetchError);
    } else {
      console.log("Updated trust score:", data.trust_score);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to update trust score:", error);
    throw error;
  }
};

export const processReferral = async (referrerId: string, newUserId: string) => {
  try {
    // Create referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrerId,
        referred_id: newUserId,
        status: 'completed',
      });
      
    if (referralError) throw referralError;
    
    // Get referrer's current trust score
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('trust_score')
      .eq('id', referrerId)
      .single();
      
    if (referrerError) throw referrerError;
    
    // Get referred user's current trust score
    const { data: referred, error: referredError } = await supabase
      .from('profiles')
      .select('trust_score')
      .eq('id', newUserId)
      .single();
      
    if (referredError) throw referredError;
    
    // Update referrer's trust score (+3)
    await updateUserTrustScore(referrerId, referrer.trust_score + 3);
    
    // Update referred user's trust score (+2)
    await updateUserTrustScore(newUserId, referred.trust_score + 2);
    
    return true;
  } catch (error) {
    console.error("Error processing referral:", error);
    throw error;
  }
};
