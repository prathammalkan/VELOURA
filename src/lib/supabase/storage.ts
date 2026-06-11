import { supabase } from './client';

export async function uploadImage(file: File): Promise<{ url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('veloura-assets')
      .upload(filePath, file);

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data } = supabase.storage
      .from('veloura-assets')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error: any) {
    return { error: error.message };
  }
}
