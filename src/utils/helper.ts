// Generate a unique ID (max 4 characters)
export const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 4).toUpperCase();
};

// Truncate the username to a maximum of 6 characters
export const truncateUsername = (username: string) => {
  return username.slice(0, 6);
};

// Generate the certificate ID based on the format
export const generateCertificateId = ({ username }: { username: string }) => {
  const prefix = '8020';
  const truncatedUsername = truncateUsername(username);
  const uniqueId = generateUniqueId();
  return `${prefix}-${truncatedUsername}-${uniqueId}`;
};
