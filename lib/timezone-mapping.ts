export interface CountryInfo {
  code: string;
  flag: string;
  name: string;
}

export const TIMEZONE_MAP: Record<string, CountryInfo> = {
  'America/New_York': { code: 'US', flag: '🇺🇸', name: 'United States' },
  'America/Los_Angeles': { code: 'US', flag: '🇺🇸', name: 'United States' },
  'America/Sao_Paulo': { code: 'BR', flag: '🇧🇷', name: 'Brazil' },
  'Europe/London': { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  'Europe/Paris': { code: 'FR', flag: '🇫🇷', name: 'France' },
  'Europe/Berlin': { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  'Asia/Kolkata': { code: 'IN', flag: '🇮🇳', name: 'India' },
  'Asia/Tokyo': { code: 'JP', flag: '🇯🇵', name: 'Japan' },
  'Asia/Shanghai': { code: 'CN', flag: '🇨🇳', name: 'China' },
  'Asia/Dubai': { code: 'AE', flag: '🇦🇪', name: 'United Arab Emirates' },
  'Asia/Jakarta': { code: 'ID', flag: '🇮🇩', name: 'Indonesia' },
  'Asia/Manila': { code: 'PH', flag: '🇵🇭', name: 'Philippines' },
  'Africa/Lagos': { code: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  'Africa/Cairo': { code: 'EG', flag: '🇪🇬', name: 'Egypt' },
  'America/Mexico_City': { code: 'MX', flag: '🇲🇽', name: 'Mexico' },
  'America/Bogota': { code: 'CO', flag: '🇨🇴', name: 'Colombia' },
  'Europe/Istanbul': { code: 'TR', flag: '🇹🇷', name: 'Turkey' },
  'Europe/Moscow': { code: 'RU', flag: '🇷🇺', name: 'Russia' },
  'Asia/Karachi': { code: 'PK', flag: '🇵🇰', name: 'Pakistan' },
  'Asia/Dhaka': { code: 'BD', flag: '🇧🇩', name: 'Bangladesh' },
  'Asia/Bangkok': { code: 'TH', flag: '🇹🇭', name: 'Thailand' },
  'Asia/Seoul': { code: 'KR', flag: '🇰🇷', name: 'South Korea' },
  'Australia/Sydney': { code: 'AU', flag: '🇦🇺', name: 'Australia' },
  'America/Toronto': { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  'America/Buenos_Aires': { code: 'AR', flag: '🇦🇷', name: 'Argentina' },
  'Asia/Riyadh': { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  'Africa/Johannesburg': { code: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  'Europe/Warsaw': { code: 'PL', flag: '🇵🇱', name: 'Poland' },
  'Europe/Amsterdam': { code: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  'Europe/Madrid': { code: 'ES', flag: '🇪🇸', name: 'Spain' },
  'America/Lima': { code: 'PE', flag: '🇵🇪', name: 'Peru' },
  'Asia/Colombo': { code: 'LK', flag: '🇱🇰', name: 'Sri Lanka' },
  'Asia/Kuala_Lumpur': { code: 'MY', flag: '🇲🇾', name: 'Malaysia' },
  'Asia/Singapore': { code: 'SG', flag: '🇸🇬', name: 'Singapore' },
  'Europe/Bucharest': { code: 'RO', flag: '🇷🇴', name: 'Romania' },
  'Europe/Kyiv': { code: 'UA', flag: '🇺🇦', name: 'Ukraine' },
  'America/Caracas': { code: 'VE', flag: '🇻🇪', name: 'Venezuela' },
  'Pacific/Auckland': { code: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
  'Asia/Tehran': { code: 'IR', flag: '🇮🇷', name: 'Iran' },
  'Asia/Baghdad': { code: 'IQ', flag: '🇮🇶', name: 'Iraq' }
};

export const COUNTRY_INFO_MAP: Record<string, { flag: string; name: string }> = {};

// Auto-populate COUNTRY_INFO_MAP from TIMEZONE_MAP
Object.values(TIMEZONE_MAP).forEach((item) => {
  COUNTRY_INFO_MAP[item.code] = { flag: item.flag, name: item.name };
});
