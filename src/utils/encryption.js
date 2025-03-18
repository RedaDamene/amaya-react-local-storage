import CryptoJS from 'crypto-js';

// Clé secrète - IMPORTANT : gardez cette clé confidentielle et ne la committez pas
const SECRET_KEY = import.meta.env.REACT_APP_ENCRYPTION_KEY || 'fallback-secret-key-change-me';

// Avertissement de sécurité si une clé par défaut est utilisée
if (SECRET_KEY === 'fallback-secret-key-change-me') {
    console.warn(
      '⚠️ AVERTISSEMENT DE SÉCURITÉ : ' +
      'Vous utilisez une clé de chiffrement par défaut. ' +
      'Définissez REACT_APP_ENCRYPTION_KEY dans votre fichier .env pour plus de sécurité.'
    );
  }
  
/**
 * Chiffre une valeur avant de la stocker dans le localStorage
 * @param {*} value - La valeur à chiffrer
 * @returns {string} Une chaîne chiffrée
 */
export const encryptStorage = (value) => {
  try {
    // Convertit la valeur en chaîne JSON pour gérer différents types de données
    const stringValue = JSON.stringify(value);
    // Chiffre la chaîne
    const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Erreur de chiffrement:', error);
    throw error;
  }
};

/**
 * Déchiffre une valeur stockée dans le localStorage
 * @param {string} encryptedValue - La valeur chiffrée à déchiffrer
 * @returns {*} La valeur déchiffrée dans son type original
 */
export const decryptStorage = (encryptedValue) => {
  try {
    // Déchiffre la chaîne
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    // Convertit le résultat déchiffré en chaîne lisible
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    // Parse la chaîne JSON pour retrouver le type original
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Erreur de déchiffrement:', error);
    throw error;
  }
};

/**
 * Enregistre une valeur chiffrée dans le localStorage
 * @param {string} key - La clé pour stocker dans localStorage
 * @param {*} value - La valeur à stocker
 */
export const setEncryptedItem = (key, value) => {
  try {
    const encrypted = encryptStorage(value);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement chiffré:', error);
  }
};

/**
 * Récupère et déchiffre une valeur du localStorage
 * @param {string} key - La clé pour récupérer du localStorage
 * @returns {*} La valeur déchiffrée, ou null si non trouvée
 */
export const getDecryptedItem = (key) => {
  try {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue === null) {
      return null;
    }
    return decryptStorage(encryptedValue);
  } catch (error) {
    console.error('Erreur lors de la récupération déchiffrée:', error);
    return null;
  }
};

/**
 * Supprime un élément du localStorage
 * @param {string} key - La clé à supprimer
 */
export const removeEncryptedItem = (key) => {
  localStorage.removeItem(key);
};