"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAuthStore } from "../lib/store/authStore";
import Header from "../components/layout/Header";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { apiClient } from "../lib/api/client";
import TambahPerdinModal from "../components/perdin/TambahPerdinModal";

interface Perdin {
  id: string;
  keterangan: string;
  tanggalBerangkat: string;
  tanggalPulang: string;
  durasiHari: number;
  kotaAsal: { namaKota: string };
  kotaTujuan: { namaKota: string };
  status: "PENDING" | "APPROVED" | "REJECTED";
  totalUangPerdin: number;
  currencyCode: string;
}

function PerdinPageContent() {
  const { user } = useAuthStore();
  const [perdins, setPerdins] = useState<Perdin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPerdins();
  }, []);

  const fetchPerdins = async () => {
    try {
    const data = await apiClient.get("/api/perdin");
  setPerdins(data);
    } catch (error) {
      console.error("Error fetching perdins:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-700",
      APPROVED: "bg-blue-100 text-blue-700",
      REJECTED: "bg-red-100 text-red-700",
    };
    const labels = {
      PENDING: "Pending",
      APPROVED: "Approved",
      REJECTED: "Rejected",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
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
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <span>📋</span>
                <span>PerdinKu</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b flex items-center justify-between">
                <h1 className="text-xl font-semibold">PerdinKu</h1>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus size={18} />
                  Tambah Perdin
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kota</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : perdins.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          Belum ada data perdin
                        </td>
                      </tr>
                    ) : (
                      perdins.map((perdin, index) => (
                        <tr key={perdin.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{index + 1}</td>
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
                                {format(new Date(perdin.tanggalBerangkat), "dd MMM", { locale: id })} - {format(new Date(perdin.tanggalPulang), "dd MMM, yyyy", { locale: id })}
                              </div>
                              <div className="text-gray-500 text-xs">({perdin.durasiHari} Hari)</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 line-clamp-2">{perdin.keterangan}</p>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(perdin.status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {showModal && (
                <TambahPerdinModal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  onSuccess={() => {
                    fetchPerdins();
                    setShowModal(false);
                  }}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function PerdinPage() {
  return (
    <ProtectedRoute>
      <PerdinPageContent />
    </ProtectedRoute>
  );
}