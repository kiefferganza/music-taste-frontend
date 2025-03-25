<template>
    <header class="app-header">
      <div class="header-container">
        <router-link to="/" class="logo">
          <span class="logo-icon">♫</span>
          <span class="logo-text">Music Taste</span>
        </router-link>

        <nav v-if="isAuthenticated" class="nav-menu">
          <router-link to="/albums" class="nav-link">Albums</router-link>
        </nav>

        <div class="auth-actions">
          <template v-if="isAuthenticated">
            <span class="user-name">{{ userName }}</span>
            <button @click="handleLogout" class="btn-logout" :disabled="loading">
              {{ loading ? 'Logging out...' : 'Logout' }}
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-link">Login</router-link>
            <router-link to="/register" class="auth-link auth-link-primary">Register</router-link>
          </template>
        </div>
      </div>
    </header>
  </template>

  <script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../../stores/auth';

  export default defineComponent({
    name: 'AppHeader',
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
      const loading = ref(false);

      const isAuthenticated = computed(() => authStore.isAuthenticated);
      const userName = computed(() => authStore.user?.name || '');

      const handleLogout = async () => {
        loading.value = true;

        try {
          await authStore.logout();
          router.push('/login');
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          loading.value = false;
        }
      };

      return {
        isAuthenticated,
        userName,
        loading,
        handleLogout
      };
    }
  });
  </script>

  <style lang="scss" scoped>
  .app-header {
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 600px) {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: 700;
    font-size: 1.25rem;

    .logo-icon {
      font-size: 1.5rem;
    }
  }

  .nav-menu {
    display: flex;
    gap: 1.5rem;

    @media (max-width: 600px) {
      width: 100%;
      justify-content: center;
      margin-top: 0.5rem;
    }
  }

  .nav-link {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--color-primary);
      transition: width 0.2s;
    }

    &:hover::after,
    &.router-link-active::after {
      width: 100%;
    }

    &.router-link-active {
      color: var(--color-primary);
    }
  }

  .auth-actions {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 600px) {
      width: 100%;
      justify-content: center;
      margin-top: 0.5rem;
    }
  }

  .user-name {
    font-weight: 500;
    color: var(--color-text);
  }

  .btn-logout {
    background: none;
    border: none;
    color: var(--color-primary);
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem;

    &:hover {
      text-decoration: underline;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .auth-link {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem;

    &:hover {
      color: var(--color-primary);
    }

    &.auth-link-primary {
      color: white;
      background-color: var(--color-primary);
      padding: 0.5rem 1rem;
      border-radius: 4px;

      &:hover {
        background-color: var(--color-primary-dark);
      }
    }
  }
  </style>