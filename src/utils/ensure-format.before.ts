import { flat, Before } from 'adminjs';

const ensureFormat = (property: string | null, baseValue?: any): Before => (request) => {
  if (request.method !== 'post') return request;
  if (!baseValue || !property) return request;

  const value = flat.get(request.payload, property);
  const mergedValue = flat.merge(baseValue, value);

  request.payload = flat.set(request.payload, property, mergedValue);

  return request;
};

export default ensureFormat;
