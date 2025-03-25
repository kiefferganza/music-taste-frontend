<template>
    <div class="auth-container">
      <div class="auth-card">
        <h1>Register</h1>
        <p class="subtitle">Create a new account</p>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              v-model="name"
              required
              placeholder="Your name"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="your@email.com"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="Your password"
              :disabled="loading"
              minlength="8"
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </div>
      </div>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';

  export default defineComponent({
    name: 'RegisterView',
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();

      const name = ref('');
      const email = ref('');
      const password = ref('');
      const error = ref('');
      const loading = ref(false);

      const handleRegister = async () => {
        loading.value = true;
        error.value = '';

        try {
          const success = await authStore.register(name.value, email.value, password.value);

          if (success) {
            router.push('/albums');
          } else {
            error.value = authStore.error || 'Registration failed. Please try again.';
          }
        } catch (err: any) {
          error.value = err.message || 'An unexpected error occurred';
        } finally {
          loading.value = false;
        }
      };

      return {
        name,
        email,
        password,
        error,
        loading,
        handleRegister
      };
    }
  });
  </script>

  <style lang="scss" scoped>
  // Reusing the same styles as LoginView
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }

  .auth-card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #fff;

    h1 {
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
      color: var(--color-primary);
    }

    .subtitle {
      margin-bottom: 1.5rem;
      color: var(--color-text-secondary);
    }
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 500;
      color: var(--color-text);
    }

    input {
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
      }

      &:disabled {
        background-color: var(--color-background-light);
        cursor: not-allowed;
      }
    }
  }

  .error-message {
    padding: 0.75rem;
    background-color: var(--color-error-bg);
    color: var(--color-error);
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .btn {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--color-primary-dark);
    }
  }

  .auth-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-secondary);

    a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
  </style>