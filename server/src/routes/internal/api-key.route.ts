import { Router } from 'express';
import {
  createApiKeyController,
  getAllKeysController,
  deleteApiKeyController,
} from '@/controllers/api-key.controller';

const apiKeyRouter = Router();

apiKeyRouter.get('/all', getAllKeysController);
apiKeyRouter.post('/create', createApiKeyController);
apiKeyRouter.delete('/:id', deleteApiKeyController);

export default apiKeyRouter;
