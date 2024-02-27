import { API_ENDPOINT, REQUEST_METHOD } from '../common';
import { useHttp } from './useHttp';
import { UserRO } from '@tbcm/common';
import { toast } from 'react-toastify';

export const useUserRevoke = () => {
  const { sendApiRequest, isLoading } = useHttp();

  const handleSubmit = (user: UserRO, cb?: () => void) => {
    const config = {
      endpoint: API_ENDPOINT.REVOKE_USER(user.id),
      method: REQUEST_METHOD.POST,
    };

    sendApiRequest(
      config,
      () => {
        cb?.();
        toast.info(`User access revoke successful.`);
      },
      () => void 0,
      'User access revoke failed',
    );
  };

  return { handleSubmit, isLoading };
};
