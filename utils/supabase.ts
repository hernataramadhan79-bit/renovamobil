import { createClient } from '@supabase/supabase-js';
import { Car, NewsPost, InboxMessage, Testimonial, AboutData, User } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or Netlify environment variables.');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false // Disabled to prevent issues with production URLs
  }
});

// Cars CRUD
export const getCars = async (): Promise<Car[]> => {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createCar = async (car: Omit<Car, 'id'>): Promise<Car> => {
  const { data, error } = await supabase
    .from('cars')
    .insert([car])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCar = async (id: string, car: Partial<Car>): Promise<Car> => {
  const { data, error } = await supabase
    .from('cars')
    .update(car)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCar = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// News CRUD
export const getNews = async (): Promise<NewsPost[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createNews = async (news: Omit<NewsPost, 'id'>): Promise<NewsPost> => {
  const { data, error } = await supabase
    .from('news')
    .insert([news])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateNews = async (id: string, news: Partial<NewsPost>): Promise<NewsPost> => {
  const { data, error } = await supabase
    .from('news')
    .update(news)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteNews = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Testimonials CRUD
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createTestimonial = async (testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonial])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
  const { data, error } = await supabase
    .from('testimonials')
    .update(testimonial)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Inbox CRUD
export const getInbox = async (): Promise<InboxMessage[]> => {
  const { data, error } = await supabase
    .from('inbox')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createInboxMessage = async (message: Omit<InboxMessage, 'id'>): Promise<InboxMessage> => {
  const { data, error } = await supabase
    .from('inbox')
    .insert([message])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateInboxMessage = async (id: string, message: Partial<InboxMessage>): Promise<InboxMessage> => {
  const { data, error } = await supabase
    .from('inbox')
    .update(message)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteInboxMessage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('inbox')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// About CRUD
export const getAbout = async (): Promise<AboutData> => {
  const { data, error } = await supabase
    .from('about')
    .select('description, mission, gallery')
    .single();

  if (error) {
    // If no data exists, return default
    if (error.code === 'PGRST116') {
      return {
        description: '',
        mission: '',
        gallery: []
      };
    }
    console.error('Error fetching about:', error);
    throw error;
  }
  return data;
};

export const updateAbout = async (about: AboutData): Promise<AboutData> => {
  const { data, error } = await supabase
    .from('about')
    .upsert([about])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Users CRUD (for admin authentication)
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) throw error;
  return data || [];
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Authentication functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      }
    }
  });

  if (error) throw error;

  // Create user record in users table if user was created
  if (data.user && data.user.email_confirmed_at) {
    // User is confirmed immediately
    await createUser({
      name: name,
      email: email,
      role: 'USER'
    });
  } else if (data.user) {
    // User needs email confirmation
    await createUser({
      name: name,
      email: email,
      role: 'USER'
    });
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  console.log('Attempting sign in for email:', email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Sign in response - data:', data, 'error:', error);

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    console.log('Sign in successful, user:', data.user?.email);
    return data;
  } catch (err) {
    console.error('Sign in exception:', err);
    throw err;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  console.log('Getting current user');
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log('getUser response - user:', user, 'authError:', authError);

    if (authError) {
      console.error('Auth error in getCurrentUser:', authError);
      throw authError;
    }

    if (!user) {
      console.log('No user found in auth');
      return null;
    }

    console.log('User found in auth:', user.email, 'confirmed:', user.email_confirmed_at);

    // Get user data from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error('Error fetching user from table:', error);
      // If user not found in users table, create it
      if (error.code === 'PGRST116') {
        console.log('User not in table, creating...');
        const newUser = await createUser({
          name: user.user_metadata?.name || 'User',
          email: user.email!,
          role: user.email === 'admin@renova.com' ? 'ADMIN' : 'USER'
        });
        return newUser;
      }
      throw error;
    }

    // Ensure admin role is correct
    if (user.email === 'admin@renova.com' && data.role !== 'ADMIN') {
      await updateUser(data.id, { role: 'ADMIN' });
      data.role = 'ADMIN';
    }

    console.log('Returning user data:', data);
    return data;
  } catch (err) {
    console.error('Exception in getCurrentUser:', err);
    throw err;
  }
};

// Setup admin user (call this once to create admin account)
export const setupAdminUser = async (email: string, password: string) => {
  try {
    // First check if admin exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!existingUser) {
      // Create admin in users table
      await createUser({
        name: 'Admin',
        email: email,
        role: 'ADMIN'
      });
    }

    // Sign up admin in auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: 'Admin',
        }
      }
    });

    if (error && error.message !== 'User already registered') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error setting up admin:', error);
    throw error;
  }
};

// Image upload to Supabase Storage
export const uploadImage = async (file: File, bucket: string = 'uploads'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};