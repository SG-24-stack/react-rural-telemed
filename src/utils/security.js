
export function encryptPatientData(data) {
  if (!data) return '';
  try {
    const stringToEncode = typeof data === 'string' ? data : JSON.stringify(data);
    return btoa(encodeURIComponent(stringToEncode));
  } catch (error) {
    console.error("Encryption Error:", error);
    return '';
  }
}

export function decryptPatientData(encryptedString) {
  if (!encryptedString) return null;
  try {
    const decodedString = decodeURIComponent(atob(encryptedString));
    try {
      return JSON.parse(decodedString);
    } catch {
      return decodedString;
    }
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
}

export const SecureStorage = {
  save: (key, data) => {
    try {
      const encryptedData = encryptPatientData(data);
      localStorage.setItem(`secure_med_${key}`, encryptedData);
    } catch (err) {
      console.error("Failed to save to SecureStorage", err);
    }
  },
  get: (key) => {
    try {
      const encryptedData = localStorage.getItem(`secure_med_${key}`);
      if (!encryptedData) return [];
      const decrypted = decryptPatientData(encryptedData);
      return decrypted !== null ? decrypted : [];
    } catch (err) {
      console.error("Failed to get from SecureStorage", err);
      return [];
    }
  }
};
