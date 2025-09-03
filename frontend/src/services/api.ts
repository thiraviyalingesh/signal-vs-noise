const API_BASE_URL = 'https://signal-vs-noise.onrender.com';

export const createTask = async (text: string) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  
  return response.json();
};