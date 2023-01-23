import path from 'path';

const getLeafletDist = () => path.join(require.resolve('leaflet'), '..');

export default getLeafletDist;
