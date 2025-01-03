export interface Device {
  id: string;
  location: string;
  aal: string;
  last_login: string;
  browser_family: string | null;
  browser_version: string | null;
  os_family: string | null;
  os_version: string | null;
  device_family: string | null;
  device_brand: string | null;
  device_model: string | null;
  is_mobile: boolean;
  is_pc: boolean;
  is_tablet: boolean;
  is_touch_capable: boolean;
  is_bot: boolean;
  current_device: boolean;
}
