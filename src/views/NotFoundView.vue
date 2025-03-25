<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <router-link to="/" class="btn-home">Go Home</router-link>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'NotFoundView'
  });
  </script>

  <style lang="scss" scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;

    h1 {
      font-size: 6rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.5rem;
      color: var(--color-text-secondary);
      margin-bottom: 2rem;
    }

    .btn-home {
      padding: 0.75rem 1.5rem;
      background-color: var(--color-primary);
      color: white;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--color-primary-dark);
      }
    }
  }
  </style>