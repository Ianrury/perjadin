// src/app/pengajuan/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Bell, Eye, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAuthStore } from "../lib/store/authStore";
import { apiClient } from "../lib/api/client";

interface Perdin {
  id: string;
  pegawai: { nama: string };
  keterangan: string;
  tanggalBerangkat: string;
  tanggalPulang: string;
  durasiHari: number;
  kotaAsal: { namaKota: string }; 
  kotaTujuan: { namaKota: string };
  jarakKm: number;
  uangSakuPerHari: number;
  totalUangPerdin: number;
  currencyCode: string;
  status: string;
}

export default function PengajuanPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<"baru" | "history">("baru");
  const [perdins, setPerdins] = useState<Perdin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerdin, setSelectedPerdin] = useState<Perdin | null>(null);

  useEffect(() => {
    fetchPerdins();
  }, [tab]);

  const fetchPerdins = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get(`/api/perdin/sdm?status=${status}`);
       setPerdins(data);
    } catch (error) {
      console.error("Error fetching perdins:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "USD") {
      return `$ ${amount.toLocaleString("en-US")}`;
    }
    return `Rp. ${amount.toLocaleString("id-ID")},-`;
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
                <span>📝</span>
                <span>Pengajuan Perdin</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h1 className="text-xl font-semibold mb-4">Pengajuan Perdin</h1>

                {/* Tabs */}
                <div className="flex gap-4 border-b">
                  <button
                    onClick={() => setTab("baru")}
                    className={`pb-3 px-1 font-medium transition-colors relative ${
                      tab === "baru"
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Pengajuan Baru
                    {tab === "baru" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setTab("history")}
                    className={`pb-3 px-1 font-medium transition-colors relative ${
                      tab === "history"
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    History Pengajuan
                    {tab === "history" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                </div>
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
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Kota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Keterangan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : perdins.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Tidak ada data pengajuan
                        </td>
                      </tr>
                    ) : (
                      perdins.map((perdin, index) => (
                        <tr key={perdin.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{index + 1}</td>
                          <td className="px-6 py-4 text-sm font-medium">
                            {perdin.pegawai.nama}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span>{perdin.kotaAsal.namaKota}</span>
                              <ArrowRight size={16} className="text-gray-800" />
                              <span>{perdin.kotaTujuan.namaKota}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div>
                                {format(new Date(perdin.tanggalBerangkat), "dd MMM", {
                                  locale: id,
                                })}{" "}
                                -{" "}
                                {format(new Date(perdin.tanggalPulang), "dd MMM, yyyy", {
                                  locale: id,
                                })}
                              </div>
                              <div className="text-gray-500 text-xs">
                                ({perdin.durasiHari} Hari)
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {perdin.keterangan}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedPerdin(perdin)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye size={18} />
                            </button>
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

      {/* Approval Modal */}
      {selectedPerdin && (
        <ApprovalModal
          perdin={selectedPerdin}
          onClose={() => setSelectedPerdin(null)}
          onSuccess={fetchPerdins}
        />
      )}
    </div>
  );
}

// Approval Modal Component
function ApprovalModal({
  perdin,
  onClose,
  onSuccess,
}: {
  perdin: Perdin;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/perdin/${perdin.id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });

      if (!response.ok) throw new Error("Gagal approve");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal approve perdin");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Alasan penolakan:");
    if (!reason) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/perdin/${perdin.id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT", rejectionReason: reason }),
      });

      if (!response.ok) throw new Error("Gagal reject");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal reject perdin");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "USD") {
      return `$ ${amount.toLocaleString("en-US")}`;
    }
    return `Rp. ${amount.toLocaleString("id-ID")},-`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="p-6 border-b bg-blue-50 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Approval Pengajuan Perdin</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <Eye size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Nama</label>
            <div className="mt-1 p-3 bg-gray-50 rounded">{perdin.pegawai.nama}</div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Kota</label>
            <div className="mt-1 flex items-center gap-2 p-3 bg-gray-50 rounded">
              <span>{perdin.kotaAsal.namaKota}</span>
              <ArrowRight size={16} />
              <span>{perdin.kotaTujuan.namaKota}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Tanggal Berangkat</label>
              <div className="mt-1 p-3 bg-gray-50 rounded">
                {format(new Date(perdin.tanggalBerangkat), "dd MMMM yyyy", {
                  locale: id,
                })}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Tanggal Pulang</label>
              <div className="mt-1 p-3 bg-gray-50 rounded">
                {format(new Date(perdin.tanggalPulang), "dd MMMM yyyy", { locale: id })}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Keterangan</label>
            <div className="mt-1 p-3 bg-gray-50 rounded">{perdin.keterangan}</div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-around text-center mb-2">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {perdin.durasiHari} Hari
                </div>
                <div className="text-xs text-gray-600 mt-1">Total Hari</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {perdin.jarakKm} KM
                </div>
                <div className="text-xs text-gray-600 mt-1">Jarak Tempuh</div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(perdin.uangSakuPerHari, perdin.currencyCode)} / Hari
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(perdin.totalUangPerdin, perdin.currencyCode)}
                </div>
                <div className="text-xs text-gray-600 mt-1">Total Uang Perdin</div>
              </div>
            </div>
          </div>

          {perdin.status === "PENDING" && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}