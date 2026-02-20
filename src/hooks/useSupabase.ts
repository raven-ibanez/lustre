import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category, SiteSettings, PaymentMethod } from '@/types';

export function useSupabase() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select(`
          *,
          variations (*),
          add_ons (*)
        `)
                .eq('available', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Product[];
        } catch (err: any) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('active', true)
                .order('sort_order', { ascending: true });

            if (error) throw error;
            return data as Category[];
        } catch (err: any) {
            setError(err.message);
            return [];
        }
    };

    const getSiteSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*');

            if (error) throw error;
            return data as SiteSettings[];
        } catch (err: any) {
            setError(err.message);
            return [];
        }
    };

    const getPaymentMethods = async () => {
        try {
            const { data, error } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('active', true)
                .order('sort_order', { ascending: true });

            if (error) throw error;
            return data as PaymentMethod[];
        } catch (err: any) {
            setError(err.message);
            return [];
        }
    };

    return {
        loading,
        error,
        getProducts,
        getCategories,
        getSiteSettings,
        getPaymentMethods
    };
}
