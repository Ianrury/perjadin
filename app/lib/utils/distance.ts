// src/lib/utils/distance.ts

/**
 * Menghitung jarak antara dua koordinat menggunakan formula Haversine
 * @param lat1 Latitude titik 1
 * @param lon1 Longitude titik 1
 * @param lat2 Latitude titik 2
 * @param lon2 Longitude titik 2
 * @returns Jarak dalam kilometer
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam kilometer
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Pembulatan 2 desimal
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Menghitung durasi hari antara dua tanggal
 */
export function calculateDuration(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // +1 karena termasuk hari berangkat
}

/**
 * Menghitung uang saku berdasarkan jarak dan klasifikasi
 */
export function calculateUangSaku(
  jarakKm: number,
  kotaAsalProvinsi: string,
  kotaTujuanProvinsi: string,
  kotaAsalPulau: string,
  kotaTujuanPulau: string,
  luarNegeri: boolean
): {
  uangSakuPerHari: number;
  currency: string;
  klasifikasi: string;
} {
  // Luar negeri
  if (luarNegeri) {
    return {
      uangSakuPerHari: 50,
      currency: "USD",
      klasifikasi: "Luar Negeri"
    };
  }

  // Jarak 0-60km
  if (jarakKm <= 60) {
    return {
      uangSakuPerHari: 0,
      currency: "IDR",
      klasifikasi: "Dalam Kota (≤60km)"
    };
  }

  // Dalam satu provinsi
  if (kotaAsalProvinsi === kotaTujuanProvinsi) {
    return {
      uangSakuPerHari: 200000,
      currency: "IDR",
      klasifikasi: "Dalam Provinsi (>60km)"
    };
  }

  // Dalam satu pulau
  if (kotaAsalPulau === kotaTujuanPulau) {
    return {
      uangSakuPerHari: 250000,
      currency: "IDR",
      klasifikasi: "Luar Provinsi - Dalam Pulau"
    };
  }

  // Luar pulau
  return {
    uangSakuPerHari: 300000,
    currency: "IDR",
    klasifikasi: "Luar Pulau"
  };
}