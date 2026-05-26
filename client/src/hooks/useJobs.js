import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchJobs = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
      const { data } = await api.get('/jobs', { params: clean });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, loading, total, pages, fetchJobs };
}
