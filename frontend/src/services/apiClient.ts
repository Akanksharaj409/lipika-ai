import { InscriptionApiService } from './apiInterface';
import { mockApiService } from './mockApi';
import { fastApiService } from './fastApiService';

// Switch between mock mode and FastAPI live service based on environment or availability
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export const apiService: InscriptionApiService = USE_MOCK ? mockApiService : fastApiService;

export const isMockMode = (): boolean => USE_MOCK;
