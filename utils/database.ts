// Renova Mobil Showroom - Local Storage Database
// 100% FREE - No external dependencies - Perfect for development and small applications

import { Car, NewsPost, InboxMessage, Testimonial, AboutData, User } from '../types';
import { INITIAL_CARS, INITIAL_NEWS, INITIAL_INBOX, INITIAL_TESTIMONIALS, INITIAL_ABOUT } from '../constants';

// ============================================================================
// CARS MANAGEMENT
// ============================================================================

export const getCars = async (): Promise<Car[]> => {
  try {
    const stored = localStorage.getItem('renova_cars');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cars:', error);
    return [];
  }
};

export const createCar = async (car: Omit<Car, 'id'>): Promise<Car> => {
  const newCar: Car = { ...car, id: Date.now().toString() };
  const cars = await getCars();
  cars.unshift(newCar);
  localStorage.setItem('renova_cars', JSON.stringify(cars));
  return newCar;
};

export const updateCar = async (id: string, car: Partial<Car>): Promise<Car> => {
  const cars = await getCars();
  const index = cars.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Car not found');
  cars[index] = { ...cars[index], ...car };
  localStorage.setItem('renova_cars', JSON.stringify(cars));
  return cars[index];
};

export const deleteCar = async (id: string): Promise<void> => {
  const cars = await getCars();
  const filtered = cars.filter(c => c.id !== id);
  localStorage.setItem('renova_cars', JSON.stringify(filtered));
};

// ============================================================================
// NEWS MANAGEMENT
// ============================================================================

export const getNews = async (): Promise<NewsPost[]> => {
  try {
    const stored = localStorage.getItem('renova_news');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading news:', error);
    return [];
  }
};

export const createNews = async (news: Omit<NewsPost, 'id'>): Promise<NewsPost> => {
  const newPost: NewsPost = { ...news, id: Date.now().toString() };
  const posts = await getNews();
  posts.unshift(newPost);
  localStorage.setItem('renova_news', JSON.stringify(posts));
  return newPost;
};

export const updateNews = async (id: string, news: Partial<NewsPost>): Promise<NewsPost> => {
  const posts = await getNews();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('News post not found');
  posts[index] = { ...posts[index], ...news };
  localStorage.setItem('renova_news', JSON.stringify(posts));
  return posts[index];
};

export const deleteNews = async (id: string): Promise<void> => {
  const posts = await getNews();
  const filtered = posts.filter(p => p.id !== id);
  localStorage.setItem('renova_news', JSON.stringify(filtered));
};

// ============================================================================
// TESTIMONIALS MANAGEMENT
// ============================================================================

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const stored = localStorage.getItem('renova_testimonials');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading testimonials:', error);
    return [];
  }
};

export const createTestimonial = async (testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
  const newTestimonial: Testimonial = { ...testimonial, id: Date.now().toString() };
  const testimonials = await getTestimonials();
  testimonials.unshift(newTestimonial);
  localStorage.setItem('renova_testimonials', JSON.stringify(testimonials));
  return newTestimonial;
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
  const testimonials = await getTestimonials();
  const index = testimonials.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Testimonial not found');
  testimonials[index] = { ...testimonials[index], ...testimonial };
  localStorage.setItem('renova_testimonials', JSON.stringify(testimonials));
  return testimonials[index];
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const testimonials = await getTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  localStorage.setItem('renova_testimonials', JSON.stringify(filtered));
};

// ============================================================================
// INBOX MANAGEMENT
// ============================================================================

export const getInbox = async (): Promise<InboxMessage[]> => {
  try {
    const stored = localStorage.getItem('renova_inbox');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading inbox:', error);
    return [];
  }
};

export const createInboxMessage = async (message: Omit<InboxMessage, 'id'>): Promise<InboxMessage> => {
  const newMessage: InboxMessage = { ...message, id: Date.now().toString() };
  const inbox = await getInbox();
  inbox.unshift(newMessage);
  localStorage.setItem('renova_inbox', JSON.stringify(inbox));
  return newMessage;
};

export const updateInboxMessage = async (id: string, message: Partial<InboxMessage>): Promise<InboxMessage> => {
  const inbox = await getInbox();
  const index = inbox.findIndex(m => m.id === id);
  if (index === -1) throw new Error('Message not found');
  inbox[index] = { ...inbox[index], ...message };
  localStorage.setItem('renova_inbox', JSON.stringify(inbox));
  return inbox[index];
};

export const deleteInboxMessage = async (id: string): Promise<void> => {
  const inbox = await getInbox();
  const filtered = inbox.filter(m => m.id !== id);
  localStorage.setItem('renova_inbox', JSON.stringify(filtered));
};

// ============================================================================
// ABOUT MANAGEMENT
// ============================================================================

export const getAbout = async (): Promise<AboutData> => {
  try {
    const stored = localStorage.getItem('renova_about');
    return stored ? JSON.parse(stored) : { description: '', mission: '', gallery: [] };
  } catch (error) {
    console.error('Error loading about:', error);
    return { description: '', mission: '', gallery: [] };
  }
};

export const updateAbout = async (about: AboutData): Promise<AboutData> => {
  localStorage.setItem('renova_about', JSON.stringify(about));
  return about;
};

// ============================================================================
// USERS MANAGEMENT
// ============================================================================

export const getUsers = async (): Promise<User[]> => {
  try {
    const stored = localStorage.getItem('renova_users');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const newUser: User = { ...user, id: Date.now().toString() };
  const users = await getUsers();
  users.push(newUser);
  localStorage.setItem('renova_users', JSON.stringify(users));
  return newUser;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');
  users[index] = { ...users[index], ...user };
  localStorage.setItem('renova_users', JSON.stringify(users));
  return users[index];
};

export const deleteUser = async (id: string): Promise<void> => {
  const users = await getUsers();
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem('renova_users', JSON.stringify(filtered));
};

// ============================================================================
// AUTHENTICATION (Simplified for Development)
// ============================================================================

const CURRENT_USER_KEY = 'renova_current_user';

export const signUp = async (email: string, password: string, name: string) => {
  const users = await getUsers();
  const existingUser = users.find(u => u.email === email);
  if (existingUser) throw new Error('User already exists');

  const newUser = await createUser({ name, email, role: 'USER' });
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return { user: newUser };
};

export const signIn = async (email: string, password: string) => {
  const users = await getUsers();
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('User not found');

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { user: user };
};

export const signOut = async () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// ============================================================================
// IMAGE UPLOAD (Local Storage - Converts to Base64)
// ============================================================================

const IMAGES_KEY = 'renova_images';

export const uploadImage = async (file: File, folder: string = 'uploads'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const base64String = reader.result as string;

        // Store image in localStorage with metadata
        const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '{}');
        const imageId = Date.now().toString();
        const imageName = `${folder}/${imageId}_${file.name}`;

        images[imageName] = {
          id: imageId,
          name: file.name,
          folder: folder,
          data: base64String,
          uploadedAt: new Date().toISOString(),
          size: file.size,
          type: file.type
        };

        localStorage.setItem(IMAGES_KEY, JSON.stringify(images));

        // Return the image name (key) for storage in records
        resolve(imageName);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const getImageUrl = (imageName: string): string => {
  if (!imageName) return '';

  try {
    const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '{}');
    const imageData = images[imageName];

    if (imageData && imageData.data) {
      return imageData.data; // This is the base64 data URL
    }
  } catch (error) {
    console.error('Error getting image:', error);
  }

  return '';
};

export const deleteImage = (imageName: string): void => {
  try {
    const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '{}');
    if (images[imageName]) {
      delete images[imageName];
      localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export const getAllImages = () => {
  try {
    return JSON.parse(localStorage.getItem(IMAGES_KEY) || '{}');
  } catch (error) {
    console.error('Error getting all images:', error);
    return {};
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const clearAllData = () => {
  localStorage.removeItem('renova_cars');
  localStorage.removeItem('renova_news');
  localStorage.removeItem('renova_testimonials');
  localStorage.removeItem('renova_inbox');
  localStorage.removeItem('renova_about');
  localStorage.removeItem('renova_users');
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(IMAGES_KEY);
};

export const forceInitializeDefaultData = async () => {
  // Force initialize all default data
  localStorage.setItem('renova_cars', JSON.stringify(INITIAL_CARS));
  localStorage.setItem('renova_news', JSON.stringify(INITIAL_NEWS));
  localStorage.setItem('renova_inbox', JSON.stringify(INITIAL_INBOX));
  localStorage.setItem('renova_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
  localStorage.setItem('renova_about', JSON.stringify(INITIAL_ABOUT));

  // Initialize users
  await initializeDefaultUsers();

  console.log('All default data force initialized');
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).forceInitData = forceInitializeDefaultData;
}

export const exportData = () => {
  return {
    cars: localStorage.getItem('renova_cars'),
    news: localStorage.getItem('renova_news'),
    testimonials: localStorage.getItem('renova_testimonials'),
    inbox: localStorage.getItem('renova_inbox'),
    about: localStorage.getItem('renova_about'),
    users: localStorage.getItem('renova_users'),
    images: localStorage.getItem(IMAGES_KEY)
  };
};

export const importData = (data: any) => {
  if (data.cars) localStorage.setItem('renova_cars', data.cars);
  if (data.news) localStorage.setItem('renova_news', data.news);
  if (data.testimonials) localStorage.setItem('renova_testimonials', data.testimonials);
  if (data.inbox) localStorage.setItem('renova_inbox', data.inbox);
  if (data.about) localStorage.setItem('renova_about', data.about);
  if (data.users) localStorage.setItem('renova_users', data.users);
  if (data.images) localStorage.setItem(IMAGES_KEY, data.images);
};

// ============================================================================
// DEFAULT DATA INITIALIZATION
// ============================================================================

export const initializeDefaultUsers = async () => {
  const users = await getUsers();

  // Create admin user if not exists
  const adminExists = users.find(u => u.email === 'admin@renova.com');
  if (!adminExists) {
    await createUser({
      name: 'Administrator',
      email: 'admin@renova.com',
      role: 'ADMIN'
    });
    console.log('Default admin user created: admin@renova.com');
  }

  // Create regular user if not exists
  const userExists = users.find(u => u.email === 'user@renova.com');
  if (!userExists) {
    await createUser({
      name: 'Regular User',
      email: 'user@renova.com',
      role: 'USER'
    });
    console.log('Default user created: user@renova.com');
  }
};

export const initializeDefaultData = async () => {
  // Initialize default users
  await initializeDefaultUsers();

  // Initialize default cars if not exists
  const existingCars = await getCars();
  if (existingCars.length === 0) {
    localStorage.setItem('renova_cars', JSON.stringify(INITIAL_CARS));
    console.log('Default cars initialized');
  }

  // Initialize default news if not exists
  const existingNews = await getNews();
  if (existingNews.length === 0) {
    localStorage.setItem('renova_news', JSON.stringify(INITIAL_NEWS));
    console.log('Default news initialized');
  }

  // Initialize default inbox if not exists
  const existingInbox = await getInbox();
  if (existingInbox.length === 0) {
    localStorage.setItem('renova_inbox', JSON.stringify(INITIAL_INBOX));
    console.log('Default inbox initialized');
  }

  // Initialize default testimonials if not exists
  const existingTestimonials = await getTestimonials();
  if (existingTestimonials.length === 0) {
    localStorage.setItem('renova_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
    console.log('Default testimonials initialized');
  }

  // Initialize default about if not exists
  try {
    const existingAbout = await getAbout();
    if (!existingAbout.description && !existingAbout.mission) {
      localStorage.setItem('renova_about', JSON.stringify(INITIAL_ABOUT));
      console.log('Default about initialized');
    }
  } catch (error) {
    localStorage.setItem('renova_about', JSON.stringify(INITIAL_ABOUT));
    console.log('Default about initialized');
  }

  console.log('Default data initialized');
};