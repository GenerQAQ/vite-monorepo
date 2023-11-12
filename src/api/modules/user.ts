import service from '@/api/http';

export const getUser = () => service.get('/login');
