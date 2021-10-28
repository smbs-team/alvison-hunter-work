import axios from 'axios';

export const SWRFetch = async (url: string) => (await axios.get(url)).data;

export const SWRFetchWithoutCredentials = async (url: string, ) => (await axios.get(url, { withCredentials: false })).data;
