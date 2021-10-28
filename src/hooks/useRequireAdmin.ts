import { useHistory } from "react-router";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Store } from '../interfaces';
import { flattenStore } from '../utils';

export function useRequireAdmin() {
  const history = useHistory();
  const {
    authLoaded,
    user,
  } = useSelector((store: Store) => flattenStore(store));
  useEffect(() => {
    if (authLoaded && user?.role !== 'ADMIN') {
      history.replace('/location');
    }
  }, [history, authLoaded, user]);
}