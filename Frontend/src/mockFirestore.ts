const store = JSON.parse(localStorage.getItem('mockDB') || '{}');

const save = () => localStorage.setItem('mockDB', JSON.stringify(store));

// A very simplified mock of the Firebase v9 Firestore SDK
export const collection = (_db: any, path: string) => path;

export const doc = (_db: any, path: string, id?: string) => {
  // Sometimes doc(db, 'collection', 'id') is passed, sometimes doc(collectionRef, 'id')
  // We'll normalize it to "path/id"
  const collectionPath = typeof _db === 'string' ? _db : path;
  const docId = id ? id : crypto.randomUUID();
  return `${collectionPath}/${docId}`;
};

export const getDocs = async (path: string) => {
  const items = store[path] || {};
  return {
    empty: Object.keys(items).length === 0,
    forEach: (cb: any) => Object.entries(items).forEach(([id, data]) => cb({ id, data: () => data }))
  };
};

export const getDoc = async (docPath: string) => {
  const parts = docPath.split('/');
  const id = parts.pop()!;
  const path = parts.join('/');
  const data = (store[path] || {})[id];
  return { 
    exists: () => !!data, 
    data: () => data, 
    id 
  };
};

export const setDoc = async (docPath: string, data: any, options?: any) => {
  const parts = docPath.split('/');
  const id = parts.pop()!;
  const path = parts.join('/');
  
  if (!store[path]) store[path] = {};
  if (options?.merge) {
    store[path][id] = { ...store[path][id], ...data };
  } else {
    store[path][id] = data;
  }
  save();
  notify(path);
};

export const addDoc = async (path: string, data: any) => {
  const id = crypto.randomUUID();
  if (!store[path]) store[path] = {};
  store[path][id] = data;
  save();
  notify(path);
  return { id };
};

export const updateDoc = async (docPath: string, data: any) => {
  const parts = docPath.split('/');
  const id = parts.pop()!;
  const path = parts.join('/');
  
  if (!store[path]) store[path] = {};
  store[path][id] = { ...store[path][id], ...data };
  save();
  notify(path);
};

const listeners: Record<string, Function[]> = {};

const notify = (path: string) => {
  (listeners[path] || []).forEach(cb => {
    const items = store[path] || {};
    cb({
      forEach: (iterCb: any) => Object.entries(items).forEach(([id, data]) => iterCb({ id, data: () => data })),
      docChanges: () => Object.entries(items).map(([id, data]) => ({ type: 'added', doc: { id, data: () => data } }))
    });
  });
};

export const onSnapshot = (pathOrQuery: any, cb: Function) => {
  const path = typeof pathOrQuery === 'string' ? pathOrQuery : pathOrQuery.path;
  if (!listeners[path]) listeners[path] = [];
  listeners[path].push(cb);
  notify(path); // trigger initial state
  
  return () => {
    listeners[path] = listeners[path].filter(l => l !== cb);
  };
};

export const serverTimestamp = () => new Date();
export const getFirestore = () => ({});
export const query = (ref: any, ) => ({ path: typeof ref === 'string' ? ref : ref.path });
export const orderBy = () => ({});
export const limit = () => ({});
