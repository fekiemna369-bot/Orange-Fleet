import { useState, useMemo, useEffect } from "react";
import { 
  useListTransactions, 
  useCreateTransaction, 
  useConfirmTransaction, 
  useDeleteTransaction,
  useGetTransaction,
  useUpdateTransaction,
  getListTransactionsQueryKey,
  getGetDashboardStatsQueryKey,
  getGetRecentTransactionsQueryKey,
  getGetTransactionQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import { Search, Plus, MoreVertical, Check, Trash2, MapPin, Package, User, Edit2 } from "lucide-react";

const formSchema = z.object({
  senderName: z.string().min(2, "Nom expéditeur requis"),
  senderPhone: z.string().optional(),
  recipientName: z.string().min(2, "Nom destinataire requis"),
  recipientPhone: z.string().optional(),
  recipientCity: z.string().min(2, "Ville requise"),
  description: z.string().optional(),
  weight: z.coerce.number().min(0.1, "Poids > 0"),
  price: z.coerce.number().min(0, "Prix >= 0"),
  status: z.enum(["en_livraison", "livree", "retournee", "annulee"]).optional(),
});

function EditTransactionModal({ id, open, onOpenChange }: { id: number | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: tx, isLoading } = useGetTransaction(id!, { query: { enabled: !!id, queryKey: getGetTransactionQueryKey(id!) } });
  const updateMutation = useUpdateTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderName: "",
      senderPhone: "",
      recipientName: "",
      recipientPhone: "",
      recipientCity: "",
      description: "",
      weight: 1,
      price: 10,
      status: "en_livraison",
    },
  });

  useEffect(() => {
    if (tx) {
      form.reset({
        senderName: tx.senderName,
        senderPhone: tx.senderPhone || "",
        recipientName: tx.recipientName,
        recipientPhone: tx.recipientPhone || "",
        recipientCity: tx.recipientCity,
        description: tx.description || "",
        weight: tx.weight,
        price: tx.price,
        status: tx.status as any,
      });
    }
  }, [tx, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    updateMutation.mutate({ id, data: values }, {
      onSuccess: () => {
        toast({ title: "Transaction modifiée" });
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRecentTransactionsQueryKey() });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">Modifier l'expédition #{tx?.trackingNumber}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-12 flex justify-center"><Skeleton className="h-40 w-full" /></div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b pb-2"><User size={16}/> Destinataire</h3>
                  <FormField control={form.control} name="recipientName" render={({ field }) => (
                    <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="recipientCity" render={({ field }) => (
                    <FormItem><FormLabel>Ville Destination</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b pb-2"><Package size={16}/> Colis & Statut</h3>
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Prix (TND)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en_livraison">En livraison</SelectItem>
                          <SelectItem value="livree">Livrée</SelectItem>
                          <SelectItem value="retournee">Retournée</SelectItem>
                          <SelectItem value="annulee">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
              <DialogFooter className="border-t pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">Annuler</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-full" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Modification..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Transactions() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query
  const { data: transactions, isLoading } = useListTransactions(
    statusFilter !== "all" ? { status: statusFilter } : {},
    { query: { queryKey: getListTransactionsQueryKey(statusFilter !== "all" ? { status: statusFilter } : {}) } }
  );

  // Mutations
  const createMutation = useCreateTransaction();
  const confirmMutation = useConfirmTransaction();
  const deleteMutation = useDeleteTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderName: "",
      senderPhone: "",
      recipientName: "",
      recipientPhone: "",
      recipientCity: "",
      description: "",
      weight: 1,
      price: 10,
    },
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey({ status: statusFilter }) });
    queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetRecentTransactionsQueryKey() });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMutation.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Transaction créée", description: "Le colis a été enregistré." });
        setIsAddOpen(false);
        form.reset();
        invalidateQueries();
      },
      onError: () => {
        toast({ title: "Erreur", description: "Impossible de créer la transaction.", variant: "destructive" });
      }
    });
  };

  const handleConfirm = (id: number) => {
    confirmMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Colis livré", description: "Le statut a été mis à jour." });
        invalidateQueries();
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Transaction supprimée" });
        invalidateQueries();
      }
    });
  };

  const filteredData = useMemo(() => {
    if (!transactions) return [];
    if (!searchQuery) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(t => 
      t.trackingNumber.toLowerCase().includes(q) ||
      t.recipientName.toLowerCase().includes(q) ||
      t.recipientCity.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Colis</h1>
          <p className="text-slate-500 mt-1">Suivez et gérez l'ensemble des expéditions</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 rounded-full shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Colis
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-slate-900">Enregistrer une expédition</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b pb-2"><User size={16}/> Expéditeur</h3>
                    <FormField control={form.control} name="senderName" render={({ field }) => (
                      <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Nom expéditeur" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="senderPhone" render={({ field }) => (
                      <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input placeholder="Optionnel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b pb-2"><User size={16}/> Destinataire</h3>
                    <FormField control={form.control} name="recipientName" render={({ field }) => (
                      <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Nom destinataire" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="recipientPhone" render={({ field }) => (
                      <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input placeholder="Optionnel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2 border-b pb-2"><Package size={16}/> Détails du Colis</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="recipientCity" render={({ field }) => (
                      <FormItem><FormLabel>Ville Destination</FormLabel><FormControl><Input placeholder="Ex: Sfax, Tunis" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem><FormLabel>Poids (kg)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem><FormLabel>Prix (TND)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="Nature du colis..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>

                <DialogFooter className="border-t pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">Annuler</Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Création..." : "Créer le colis"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50 justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Rechercher par tracking, nom ou ville..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full bg-white"
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-full bg-white">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_livraison">En livraison</SelectItem>
                <SelectItem value="livree">Livrée</SelectItem>
                <SelectItem value="retournee">Retournée</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-medium text-slate-600">Tracking</TableHead>
                <TableHead className="font-medium text-slate-600">Destinataire</TableHead>
                <TableHead className="font-medium text-slate-600">Ville</TableHead>
                <TableHead className="font-medium text-slate-600">Statut</TableHead>
                <TableHead className="font-medium text-slate-600 text-right">Prix</TableHead>
                <TableHead className="font-medium text-slate-600 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    Aucune transaction trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {filteredData.map((tx, index) => (
                    <motion.tr 
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-slate-50/50 transition-colors border-b"
                    >
                      <TableCell className="font-mono text-slate-600 font-medium">{tx.trackingNumber}</TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{tx.recipientName}</div>
                        {tx.recipientPhone && <div className="text-xs text-slate-500">{tx.recipientPhone}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          {tx.recipientCity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tx.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {tx.price.toFixed(3)} TND
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-md">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            {tx.status === 'en_livraison' && (
                              <DropdownMenuItem 
                                className="cursor-pointer text-green-600 font-medium focus:text-green-700"
                                onClick={() => handleConfirm(tx.id)}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Marquer Livrée
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => setEditId(tx.id)}
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-700"
                              onClick={() => handleDelete(tx.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <EditTransactionModal id={editId} open={editId !== null} onOpenChange={(open) => !open && setEditId(null)} />
    </div>
  );
}
