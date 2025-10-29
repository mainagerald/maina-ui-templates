
// Get auth header with JWT token
export const getAuthHeader = async (): Promise<{ Authorization: string }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return { Authorization: `Bearer ${token}` };
};
