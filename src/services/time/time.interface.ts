export interface ITimeService {
  getCurrentTime(timezone?: string): ICurrentTime;
}

export interface ICurrentTime {
  timezone: string;
  iso: string;
  local: string;
}
