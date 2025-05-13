
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PGListing } from '@/types';

export const usePGListings = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Fetch all published PG listings
  const { data: listings, isLoading: isLoadingListings } = useQuery({
    queryKey: ['pg-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pg_listings')
        .select(`
          *,
          rooms (*),
          favorites (*)
        `)
        .eq('status', 'published');

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's own listings
  const { data: userListings, isLoading: isLoadingUserListings } = useQuery({
    queryKey: ['user-listings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('pg_listings')
        .select(`
          *,
          rooms (*),
          favorites (*)
        `)
        .eq('owner_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  // Upload images and return URLs
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Update progress handling to match Supabase options
      const { error: uploadError, data } = await supabase.storage
        .from('pg_images')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pg_images')
        .getPublicUrl(filePath);

      urls.push(publicUrl);
      
      // Update progress manually since onUploadProgress is not available
      setUploadProgress((urls.length / files.length) * 100);
    }

    return urls;
  };

  // Create or update PG listing
  const createPGListing = async (listing: Partial<PGListing>) => {
    // Directly pass the single object instead of wrapping in array
    const { data, error } = await supabase
      .from('pg_listings')
      .insert(listing)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Toggle favorite status
  const toggleFavorite = async (pgId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select()
      .eq('pg_id', pgId)
      .eq('user_id', user.id)
      .single();

    if (existingFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('pg_id', pgId)
        .eq('user_id', user.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ pg_id: pgId, user_id: user.id });

      if (error) throw error;
    }

    // Invalidate queries to refetch data
    queryClient.invalidateQueries({ queryKey: ['pg-listings'] });
    queryClient.invalidateQueries({ queryKey: ['user-listings'] });
  };

  return {
    listings,
    userListings,
    isLoadingListings,
    isLoadingUserListings,
    uploadImages,
    uploadProgress,
    createPGListing,
    toggleFavorite,
  };
};
