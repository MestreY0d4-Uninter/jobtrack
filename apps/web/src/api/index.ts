import { createJobTrackApiClient, type JobTrackApi } from './client';
import { createDemoJobTrackApiClient } from './demoClient';

export type { JobTrackApi } from './client';

export const jobTrackApi: JobTrackApi =
  import.meta.env.VITE_DEMO_MODE === 'true'
    ? createDemoJobTrackApiClient()
    : createJobTrackApiClient();
