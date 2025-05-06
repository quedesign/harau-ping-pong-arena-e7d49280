
import { useState } from 'react';

export const useMockLogins = () => {
  const loginWithGithub = async () => {
    console.warn("GitHub login not implemented yet");
    return Promise.resolve();
  };

  const loginAsTestUser = async () => {
    console.warn("Test user login not implemented yet");
    return Promise.resolve();
  };

  return { loginWithGithub, loginAsTestUser };
};
