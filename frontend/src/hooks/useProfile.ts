import { useState } from 'react';
import { useUsers } from './useUsers';

export const useProfile = () => {
  const { profile, updateProfile, isUpdatingProfile, updateProfileError } = useUsers();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = (data: any) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return {
    profile,
    isEditing,
    setIsEditing,
    updateProfile: handleUpdateProfile,
    isUpdatingProfile,
    updateProfileError,
  };
};