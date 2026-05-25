import servicesConfig from '../../configs/services.json';

export const SERVICE_NAMES = servicesConfig.map(s => s.name);
export default SERVICE_NAMES;
