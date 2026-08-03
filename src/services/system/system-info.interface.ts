export interface SystemInfo {
  platform: string;
  hostname: string;
  architecture: string;
  nodeVersion: string;
  uptime: number;
}

export interface ISystemInfoService {
  getSystemInfo(): SystemInfo;
}