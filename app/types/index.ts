// src/types/index.ts

export type Role = "PEGAWAI" | "DIVISI_SDM" | "ADMIN";

export type StatusPerdin = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  username: string;
  nama: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Kota {
  id: string;
  namaKota: string;
  latitude: number;
  longitude: number;
  provinsi: string;
  pulau: string;
  luarNegeri: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Perdin {
  id: string;
  pegawaiId: string;
  pegawai?: User;
  keterangan: string;
  tanggalBerangkat: Date;
  tanggalPulang: Date;
  durasiHari: number;
  kotaAsalId: string;
  kotaAsal?: Kota;
  kotaTujuanId: string;
  kotaTujuan?: Kota;
  jarakKm: number;
  uangSakuPerHari: number;
  totalUangPerdin: number;
  currencyCode: string;
  status: StatusPerdin;
  approvedById?: string;
  approvedBy?: User;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface CreatePerdinRequest {
  kotaAsalId: string;
  kotaTujuanId: string;
  tanggalBerangkat: string;
  tanggalPulang: string;
  keterangan: string;
  durasiHari: number;
  jarakKm: number;
  uangSakuPerHari: number;
  totalUangPerdin: number;
  currency: string;
}

export interface ApprovalRequest {
  action: "APPROVE" | "REJECT";
  rejectionReason?: string;
}

export interface KotaFormData {
  namaKota: string;
  provinsi: string;
  pulau: string;
  latitude: number;
  longitude: number;
  luarNegeri: boolean;
}