"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { calculateDistance, calculateDuration, calculateUangSaku } from "@/app/lib/utils/distance";
import { apiClient } from "@/app/lib/api/client";


interface Kota {
  id: string;
  namaKota: string;
  latitude: number;
  longitude: number;
  provinsi: string;
  pulau: string;
  luarNegeri: boolean;
}

interface TambahPerdinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TambahPerdinModal({ isOpen, onClose, onSuccess }: TambahPerdinModalProps) {
  const [kotas, setKotas] = useState<Kota[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kotaAsalId: "",
    kotaTujuanId: "",
    tanggalBerangkat: "",
    tanggalPulang: "",
    keterangan: "",
  });

  const [calculated, setCalculated] = useState({
    durasiHari: 0,
    jarakKm: 0,
    uangSakuPerHari: 0,
    totalUangPerdin: 0,
    currency: "IDR",
  });

  useEffect(() => {
    if (isOpen) {
      fetchKotas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      formData.kotaAsalId &&
      formData.kotaTujuanId &&
      formData.tanggalBerangkat &&
      formData.tanggalPulang
    ) {
      calculatePerdin();
    }
  }, [formData]);

const fetchKotas = async () => {
  const data = await apiClient.get("/api/kota");
  setKotas(data);
};


  const calculatePerdin = () => {
    const kotaAsal = kotas.find((k) => k.id === formData.kotaAsalId);
    const kotaTujuan = kotas.find((k) => k.id === formData.kotaTujuanId);

    if (!kotaAsal || !kotaTujuan) return;

    const jarak = calculateDistance(
      kotaAsal.latitude,
      kotaAsal.longitude,
      kotaTujuan.latitude,
      kotaTujuan.longitude
    );

    const durasi = calculateDuration(
      new Date(formData.tanggalBerangkat),
      new Date(formData.tanggalPulang)
    );

    const { uangSakuPerHari, currency } = calculateUangSaku(
      jarak,
      kotaAsal.provinsi,
      kotaTujuan.provinsi,
      kotaAsal.pulau,
      kotaTujuan.pulau,
      kotaTujuan.luarNegeri
    );

    const total = uangSakuPerHari * durasi;

    setCalculated({
      durasiHari: durasi,
      jarakKm: jarak,
      uangSakuPerHari,
      totalUangPerdin: total,
      currency,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/api/perdin", { ...formData, ...calculated });
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menambah perdin");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      kotaAsalId: "",
      kotaTujuanId: "",
      tanggalBerangkat: "",
      tanggalPulang: "",
      keterangan: "",
    });
    setCalculated({
      durasiHari: 0,
      jarakKm: 0,
      uangSakuPerHari: 0,
      totalUangPerdin: 0,
      currency: "IDR",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-blue-50">
          <h2 className="text-xl font-semibold">Tambah Perdin</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Kota */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Kota
            </label>
            <div className="flex items-center gap-3">
              <select
                value={formData.kotaAsalId}
                onChange={(e) =>
                  setFormData({ ...formData, kotaAsalId: e.target.value })
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih kota asal</option>
                {kotas.map((kota) => (
                  <option key={kota.id} value={kota.id}>
                    {kota.namaKota}
                  </option>
                ))}
              </select>

              <ArrowRight className="text-gray-800" />

              <select
                value={formData.kotaTujuanId}
                onChange={(e) =>
                  setFormData({ ...formData, kotaTujuanId: e.target.value })
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih kota tujuan</option>
                {kotas.map((kota) => (
                  <option key={kota.id} value={kota.id}>
                    {kota.namaKota}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Tanggal
            </label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={formData.tanggalBerangkat}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalBerangkat: e.target.value })
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <ArrowRight className="text-gray-800" />

              <input
                type="date"
                value={formData.tanggalPulang}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalPulang: e.target.value })
                }
                min={formData.tanggalBerangkat}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Keterangan */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Keterangan
            </label>
            <textarea
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Maksud tujuan perjalanan dinas..."
              required
            />
          </div>

          {/* Calculated Info */}
          {calculated.durasiHari > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-center mb-4">
                Total Perjalanan Dinas
              </h3>
              <div className="flex justify-around text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {calculated.durasiHari} Hari
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Total Hari</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {calculated.jarakKm} KM
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Jarak Tempuh</div>
                  <div className="text-xs text-gray-500">
                    {calculated.currency === "USD"
                      ? `$ ${calculated.uangSakuPerHari} / Hari`
                      : `Rp. ${calculated.uangSakuPerHari.toLocaleString("id-ID")} / Hari`}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {calculated.currency === "USD"
                      ? `$ ${calculated.totalUangPerdin.toLocaleString("en-US")}`
                      : `Rp. ${calculated.totalUangPerdin.toLocaleString("id-ID")},-`}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Total Uang Perdin
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading || calculated.durasiHari === 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}