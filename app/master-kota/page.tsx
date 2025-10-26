// src/app/master-kota/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Bell, Plus, Edit, Trash2 } from "lucide-react";
import { useAuthStore } from "../lib/store/authStore";
import { apiClient } from "../lib/api/client";

interface Kota {
  id: string;
  namaKota: string;
  provinsi: string;
  pulau: string;
  latitude: number;
  longitude: number;
  luarNegeri: boolean;
}

export default function MasterKotaPage() {
  const { user } = useAuthStore();
  const [kotas, setKotas] = useState<Kota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingKota, setEditingKota] = useState<Kota | null>(null);

  useEffect(() => {
    fetchKotas();
  }, []);

  const fetchKotas = async () => {
    try {
     const data = await apiClient.get("/api/kota");
  setKotas(data);
    } catch (error) {
      console.error("Error fetching kotas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kota ini?")) return;

    try {
      const response = await fetch(`/api/kota/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal menghapus");

      fetchKotas();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus kota");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-700">AKHDANI</span>
            <div className="flex gap-0.5">
              <div className="w-1.5 h-5 bg-gray-400 rounded-sm"></div>
              <div className="w-1.5 h-5 bg-orange-400 rounded-sm"></div>
              <div className="w-1.5 h-5 bg-orange-500 rounded-sm"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user?.nama}</span>
              <button className="text-gray-800">▼</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <span>🗺️</span>
                <span>Master Kota</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b flex items-center justify-between">
                <h1 className="text-xl font-semibold">Master Kota</h1>
                <button
                  onClick={() => {
                    setEditingKota(null);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus size={18} />
                  Tambah Kota
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nama Kota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Provinsi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pulau
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Luar Negeri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Latitude
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Longitude
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : kotas.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          Belum ada data kota
                        </td>
                      </tr>
                    ) : (
                      kotas.map((kota, index) => (
                        <tr key={kota.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{index + 1}</td>
                          <td className="px-6 py-4 text-sm font-medium">
                            {kota.namaKota}
                          </td>
                          <td className="px-6 py-4 text-sm">{kota.provinsi}</td>
                          <td className="px-6 py-4 text-sm">{kota.pulau}</td>
                          <td className="px-6 py-4 text-sm">
                            {kota.luarNegeri ? "Ya" : "Tidak"}
                          </td>
                          <td className="px-6 py-4 text-sm">{kota.latitude}</td>
                          <td className="px-6 py-4 text-sm">{kota.longitude}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingKota(kota);
                                  setShowModal(true);
                                }}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(kota.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <KotaModal
          kota={editingKota}
          onClose={() => {
            setShowModal(false);
            setEditingKota(null);
          }}
          onSuccess={fetchKotas}
        />
      )}
    </div>
  );
}

// Kota Modal Component
function KotaModal({
  kota,
  onClose,
  onSuccess,
}: {
  kota: Kota | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    namaKota: kota?.namaKota || "",
    provinsi: kota?.provinsi || "",
    pulau: kota?.pulau || "",
    latitude: kota?.latitude || 0,
    longitude: kota?.longitude || 0,
    luarNegeri: kota?.luarNegeri || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = kota ? `/api/kota/${kota.id}` : "/api/kota";
      const method = kota ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menyimpan");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan kota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="p-6 border-b bg-blue-50">
          <h2 className="text-xl font-semibold">
            {kota ? "Edit Kota" : "Tambah Kota"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kota
            </label>
            <input
              type="text"
              value={formData.namaKota}
              onChange={(e) =>
                setFormData({ ...formData, namaKota: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provinsi
            </label>
            <input
              type="text"
              value={formData.provinsi}
              onChange={(e) =>
                setFormData({ ...formData, provinsi: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pulau
            </label>
            <input
              type="text"
              value={formData.pulau}
              onChange={(e) =>
                setFormData({ ...formData, pulau: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="luarNegeri"
              checked={formData.luarNegeri}
              onChange={(e) =>
                setFormData({ ...formData, luarNegeri: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="luarNegeri" className="text-sm font-medium text-gray-700">
              Luar Negeri
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}