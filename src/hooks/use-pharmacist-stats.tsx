import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PharmacistStats {
    weight_loss: number;
    hair_loss: number;
    blood_test: number;
    travel_clinic: number;
    pharmacy_first: number;
    shop: number;
}

export function usePharmacistStats() {
    const [stats, setStats] = useState<PharmacistStats>({
        weight_loss: 0,
        hair_loss: 0,
        blood_test: 0,
        travel_clinic: 0,
        pharmacy_first: 0,
        shop: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            // In a real scenario, we might want to optimize this with a database function
            // or a materialized view. For now, we perform parallel count queries.
            
            // 1. Clinical Review Queue (Pending)
            const weightQuery = supabase
                .from('consultations')
                .select('id', { count: 'exact', head: true })
                .eq("status", "pending_review")
                .eq("service_type", "weight_loss");

            const hairQuery = supabase
                .from('consultations')
                .select('id', { count: 'exact', head: true })
                .eq("status", "pending_review")
                .eq("service_type", "hair_loss");

            // 2. Appointments (Booked)
            const bloodQuery = supabase
                .from('consultations')
                .select('id', { count: 'exact', head: true })
                .eq("status", "booked")
                .eq("service_type", "blood_test");

            const pharmacyFirstQuery = supabase
                .from('consultations')
                .select('id', { count: 'exact', head: true })
                .eq("status", "booked")
                .eq("service_type", "pharmacy_first");

            // 3. Inventory Checks (Paid/Inventory Check)
            const travelQuery = supabase
                .from('consultations')
                .select('id', { count: 'exact', head: true })
                .eq("status", "inventory_check")
                .eq("service_type", "travel_clinic");

            const shopQuery = supabase
                .from('consultations')
                .select('id', { count: 'exact', head: true })
                .eq("status", "inventory_check")
                .eq("service_type", "shop");

            const [
                { count: weight },
                { count: hair },
                { count: blood },
                { count: pharmFirst },
                { count: travel },
                { count: shop }
            ] = await Promise.all([
                weightQuery,
                hairQuery,
                bloodQuery,
                pharmacyFirstQuery,
                travelQuery,
                shopQuery
            ]);

            setStats({
                weight_loss: weight || 0,
                hair_loss: hair || 0,
                blood_test: blood || 0,
                travel_clinic: travel || 0,
                pharmacy_first: pharmFirst || 0,
                shop: shop || 0
            });
        } catch (error) {
            console.error("Error fetching pharmacist stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        // Subscribe to changes in the consultations table
        const channel = supabase
            .channel('pharmacist-stats-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'consultations'
                },
                () => {
                    fetchStats();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { stats, loading };
}
