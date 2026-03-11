import { envs } from 'src/config/envs';

/** Mapa con un solo pin */
export const generateMapboxImage = (lat: number, lon: number): string => {
  const accessToken = envs.MAPBOX_TOKEN;
  const zoom = 14;
  const width = 800;
  const height = 400;
  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s-l+000(${lon},${lat})/${lon},${lat},${zoom}/${width}x${height}?access_token=${accessToken}`;
};

/**
 * Mapa estático con DOS pins:
 * - Pin rojo (corazón) donde se perdió la mascota
 * - Pin verde (estrella) donde fue encontrada
 */
export const generateDualMapboxImage = (
  lostLat: number,
  lostLon: number,
  foundLat: number,
  foundLon: number,
): string => {
  const accessToken = envs.MAPBOX_TOKEN;
  const centerLat = (lostLat + foundLat) / 2;
  const centerLon = (lostLon + foundLon) / 2;
  const zoom = 14;
  const width = 800;
  const height = 400;

  const lostPin = `pin-s-heart+e74c3c(${lostLon},${lostLat})`;
  const foundPin = `pin-s-star+2ecc71(${foundLon},${foundLat})`;

  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${lostPin},${foundPin}/${centerLon},${centerLat},${zoom}/${width}x${height}?access_token=${accessToken}`;
};