export interface Task {
  id: number;
  text: string;
  classification: 'signal' | 'noise';
  confidence: number;
  created_at: string;
}