<template>
    <footer class="app-footer">
      <div class="footer-container">
        <p class="copyright">© {{ currentYear }} Music Taste App. All rights reserved.</p>
        <p class="tagline">Discover the office's favorite music</p>
      </div>
    </footer>
  </template>

  <script lang="ts">
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    name: 'AppFooter',
    setup() {
      const currentYear = computed(() => new Date().getFullYear());

      return {
        currentYear
      };
    }
  });
  </script>

  <style lang="scss" scoped>
  .app-footer {
    background-color: var(--color-background-dark);
    color: var(--color-text-light);
    padding: 1.5rem;
    margin-top: 3rem;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .copyright {
    font-size: 0.875rem;
  }

  .tagline {
    font-size: 0.75rem;
    opacity: 0.8;
  }
  </style>