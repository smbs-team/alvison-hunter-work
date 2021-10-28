import { useState, useEffect } from 'react';
import { getConfigCatVal } from '../utils/getConfigCatVal';

export const useConfigcatText = (flagId: string, defaultValue: string) => {
  const [text, setText] = useState<string>('');
  useEffect(() => {
    async function _inner() {
      const value = await getConfigCatVal(flagId, defaultValue);
      setText(value);
    }
    _inner();
  }, [flagId]);
  return text;
};
