const API_BASE_URL = 'http://127.0.0.1:8000';

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