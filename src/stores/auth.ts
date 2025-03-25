import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/authService';
import type { User } from '../types/User';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Initialize user from token if available
  if (token.value) {
    fetchUserProfile();
  }

  async function fetchUserProfile() {
    try {
      loading.value = true;
      // This would be an API call to get user profile
      // For now, we'll just decode the token or use stored user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      user.value = userData;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      error.value = 'Failed to load user profile';
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    try {
      loading.value = true;
      error.value = null;

      const response = await authService.login(email, password);
      token.value = response.token;
      localStorage.setItem('token', response.token);

      // Store user data
      user.value = response.user;
      localStorage.setItem('user', JSON.stringify(response.user));

      return true;
    } catch (err: any) {
      console.error('Login failed:', err);
      error.value = err.message || 'Login failed. Please check your credentials.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      loading.value = true;
      error.value = null;

      const response = await authService.register(name, email, password);
      token.value = response.token;
      localStorage.setItem('token', response.token);

      // Store user data
      user.value = response.user;
      localStorage.setItem('user', JSON.stringify(response.user));

      return true;
    } catch (err: any) {
      console.error('Registration failed:', err);
      error.value = err.message || 'Registration failed. Please try again.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      loading.value = true;

      if (token.value) {
        await authService.logout(token.value);
      }

      // Clear user data regardless of API response
      user.value = null;
      token.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return true;
    } catch (err: any) {
      console.error('Logout failed:', err);
      // Still clear local data even if API call fails
      user.value = null;
      token.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return true;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUserProfile
  };
});