import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      MODULE_ID: '12790332-8467-45f3-bc86-5d8536b32c38',
      LESSON_ID: '64756656-a744-4621-9485-14235d195486',
    }
  },
});
