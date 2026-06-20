import { useGetDashboardStats, useGetRecentTransactions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle2, XCircle, AlertCircle, DollarSign } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recent, isLoading: recentLoading } = useGetRecentTransactions();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">Aperçu en temps réel de votre activité logistique</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/transactions">
            <Button className="bg-primary hover:bg-primary/90 rounded-full">
              Toutes les transactions
            </Button>
          </Link>
        </div>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : stats ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="rounded-xl shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Colis</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
              <p className="text-xs text-slate-500 mt-1">+{stats.todayDeliveries} aujourd'hui</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">En Livraison</CardTitle>
              <Truck className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.enLivraison}</div>
              <p className="text-xs text-orange-600 mt-1 font-medium">Actifs sur la route</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Livrés</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.livrees}</div>
              <p className="text-xs text-green-600 mt-1 font-medium">Arrivés à destination</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl shadow-sm border-slate-200 bg-slate-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Revenu Total</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalRevenue.toFixed(3)} <span className="text-lg">TND</span></div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-900">Transactions Récentes</h2>
              <Link href="/transactions" className="text-sm text-primary font-medium hover:underline">
                Voir tout
              </Link>
            </div>
            
            <div className="p-0">
              {recentLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : recent && recent.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
                      <tr>
                        <th className="px-6 py-3 font-medium">Tracking</th>
                        <th className="px-6 py-3 font-medium">Destinataire</th>
                        <th className="px-6 py-3 font-medium">Ville</th>
                        <th className="px-6 py-3 font-medium text-right">Prix</th>
                        <th className="px-6 py-3 font-medium text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recent.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-600 font-medium">{tx.trackingNumber}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{tx.recipientName}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{tx.recipientCity}</td>
                          <td className="px-6 py-4 font-medium text-right">{tx.price.toFixed(3)} TND</td>
                          <td className="px-6 py-4 text-center">
                            <StatusBadge status={tx.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <Package className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                  <p>Aucune transaction récente</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="rounded-xl shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg">Résumé des anomalies</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 text-red-800">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Retournées</span>
                  </div>
                  <span className="font-bold text-lg">{stats?.retournees || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Annulées</span>
                  </div>
                  <span className="font-bold text-lg">{stats?.annulees || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
