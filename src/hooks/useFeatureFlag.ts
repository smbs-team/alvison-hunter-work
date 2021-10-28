import { useState, useEffect } from 'react';
import { getConfigCatVal } from '../utils';

const { REACT_APP_FORCE_WEWORK } = process?.env;

export const useFeatureFlag = (flagId: string) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  useEffect(() => {
    async function _getConfigCatFlag() {
      try {
        const val = await getConfigCatVal(flagId, false);
        setIsEnabled(val);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }
    _getConfigCatFlag();
  }, [flagId]);
  if (['weworkaddressselect', 'slotBasedOrderScheduler'].includes(flagId) && REACT_APP_FORCE_WEWORK) {
    return { 
      isEnabled: true,
      loading: false,
    }
  }
  return { isEnabled, loading, error };
};
