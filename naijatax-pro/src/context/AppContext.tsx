import React, { createContext, useContext, useState, useEffect } from 'react';

interface Profile {
  id: string;
  name: string;
  industry: string;
}

interface AppContextType {
  profiles: Profile[];
  addProfile: (profile: Omit<Profile, 'id'>) => boolean;
  deleteProfile: (id: string) => void;
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('profiles');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    return localStorage.getItem('activeProfileId');
  });

  useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('activeProfileId', activeProfileId);
    } else {
      localStorage.removeItem('activeProfileId');
    }
  }, [activeProfileId]);

  const addProfile = (profile: Omit<Profile, 'id'>) => {
    const newProfile = { ...profile, id: crypto.randomUUID() };
    setProfiles([...profiles, newProfile]);
    if (!activeProfileId) setActiveProfileId(newProfile.id);
    return true;
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
    if (activeProfileId === id) setActiveProfileId(null);
  };

  return (
    <AppContext.Provider value={{
      profiles,
      addProfile,
      deleteProfile,
      activeProfileId,
      setActiveProfileId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
