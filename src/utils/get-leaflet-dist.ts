import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const getLeafletDist = () => path.join(require.resolve('leaflet'), '..');

export default getLeafletDist;
