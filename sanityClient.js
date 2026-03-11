import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID?.trim() || '032n3f6j',
    dataset: import.meta.env.VITE_SANITY_DATASET?.trim() || 'production',
    useCdn: true,
    apiVersion: '2025-03-09',
});

