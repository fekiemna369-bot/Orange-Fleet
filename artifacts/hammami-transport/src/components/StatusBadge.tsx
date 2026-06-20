import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "@workspace/api-client-react";

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'en_livraison':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 rounded-full px-3">En livraison</Badge>;
    case 'livree':
      return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 rounded-full px-3">Livrée</Badge>;
    case 'retournee':
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 rounded-full px-3">Retournée</Badge>;
    case 'annulee':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 rounded-full px-3">Annulée</Badge>;
    default:
      return <Badge variant="outline" className="rounded-full px-3">{status}</Badge>;
  }
}
