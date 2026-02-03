
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PharmacistStats {
    weight_loss: number;
    hair_loss: number;
    blood_test: number;
    travel_clinic: number;
    pharmacy_first: number;
    shop: number;
    [key: string]: number; // Add index signature
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

    useEffect(() => {
        fetchStats();

        // Subscribe to changes in consultations table
        const channel = supabase
            .channel('public:consultations')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'consultations' },
                () => {
                    fetchStats();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchStats = async () => {
        try {
            // In a real production app with millions of rows, you'd want a separate stats table or materialized view.
            // For now, simple aggregation is fine.
            const { data, error } = await supabase
                .from("consultations")
                .select("service_type, status")
                .in("status", ["pending_review", "booked", "inventory_check"]);

            if (error) {
                console.error("Error fetching stats:", error);
                return;
            }

            const newStats: PharmacistStats = {
                weight_loss: 0,
                hair_loss: 0,
                blood_test: 0,
                travel_clinic: 0,
                pharmacy_first: 0,
                shop: 0
            };

            data?.forEach((row: any) => {
                const type = row.service_type as keyof PharmacistStats;
                if (newStats[type] !== undefined) {
                    newStats[type]++;
                }
            });

            setStats(newStats);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { stats, loading, refreshStats: fetchStats };
}
