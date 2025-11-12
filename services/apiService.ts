import { LogEntry } from '../types';

const API_BASE_URL = '/api';

export const apiService = {
  async getAllLogs(): Promise<LogEntry[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },

  async createLog(log: LogEntry): Promise<LogEntry> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });
      if (!response.ok) {
        throw new Error('Failed to create log');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating log:', error);
      throw error;
    }
  },

  async deleteLog(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete log');
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  },
};
