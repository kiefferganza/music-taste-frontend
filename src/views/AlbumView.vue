<template>
    <div class="albums-container">
      <div class="albums-header">
        <h1>Office Music Collection</h1>
        <p class="subtitle">Vote for your favorite music to be played in the office</p>

        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search albums..."
            @input="handleSearch"
            class="search-input"
          />
        </div>
      </div>

      <div v-if="loading && !albums.length" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading albums...</p>
      </div>

      <div v-else-if="error && !albums.length" class="error-container">
        <p>{{ error }}</p>
        <button @click="loadAlbums" class="btn btn-secondary">Try Again</button>
      </div>

      <div v-else-if="!filteredAlbums.length" class="empty-container">
        <p>No albums found. Try a different search term.</p>
      </div>

      <div v-else class="albums-grid">
        <album-card
          v-for="album in filteredAlbums"
          :key="album.id"
          :album="album"
          @vote="handleVote"
          @delete="handleDelete"
        />
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="prevPage"
          :disabled="currentPage === 1 || loading"
          class="btn btn-pagination"
        >
          Previous
        </button>

        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages || loading"
          class="btn btn-pagination"
        >
          Next
        </button>
      </div>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent, ref, computed, onMounted, watch } from 'vue';
  import { useAlbumStore } from '../stores/album';
  import { useAuthStore } from '../stores/auth';
  import AlbumCard from '../components/albums/AlbumCard.vue';

  export default defineComponent({
    name: 'AlbumView',
    components: {
      AlbumCard
    },
    setup() {
      const albumStore = useAlbumStore();
      const authStore = useAuthStore();

      const searchQuery = ref('');
      const searchTimeout = ref<number | null>(null);

      // Computed properties
      const albums = computed(() => albumStore.albums);
      const filteredAlbums = computed(() => albumStore.filteredAlbums);
      const loading = computed(() => albumStore.loading);
      const error = computed(() => albumStore.error);
      const currentPage = computed(() => albumStore.currentPage);
      const totalPages = computed(() => albumStore.totalPages);

      // Load albums on component mount
      onMounted(() => {
        loadAlbums();
      });

      // Methods
      const loadAlbums = async () => {
        await albumStore.fetchAlbums(currentPage.value, searchQuery.value);
      };

      const handleSearch = () => {
        // Debounce search input
        if (searchTimeout.value) {
          clearTimeout(searchTimeout.value);
        }

        searchTimeout.value = setTimeout(() => {
          albumStore.setSearchQuery(searchQuery.value);
          loadAlbums();
        }, 300) as unknown as number;
      };

      const handleVote = async (albumId: number, voteType: 'upvote' | 'downvote') => {
        await albumStore.voteOnAlbum(albumId, voteType);
      };

      const handleDelete = async (albumId: number) => {
        if (confirm('Are you sure you want to delete this album?')) {
          await albumStore.deleteAlbum(albumId);
        }
      };

      const nextPage = () => {
        if (currentPage.value < totalPages.value) {
          albumStore.currentPage++;
          loadAlbums();
        }
      };

      const prevPage = () => {
        if (currentPage.value > 1) {
          albumStore.currentPage--;
          loadAlbums();
        }
      };

      // Watch for search query changes
      watch(searchQuery, (newValue) => {
        albumStore.setSearchQuery(newValue);
      });

      return {
        albums,
        filteredAlbums,
        loading,
        error,
        currentPage,
        totalPages,
        searchQuery,
        loadAlbums,
        handleSearch,
        handleVote,
        handleDelete,
        nextPage,
        prevPage,
        isAdmin: computed(() => authStore.isAdmin)
      };
    }
  });
  </script>

  <style lang="scss" scoped>
  .albums-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .albums-header {
    text-align: center;
    margin-bottom: 1rem;

    h1 {
      font-size: 2rem;
      color: var(--color-primary);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--color-text-secondary);
      margin-bottom: 1.5rem;
    }
  }

  .search-container {
    max-width: 500px;
    margin: 0 auto;
    width: 100%;

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
      }
    }
  }

  .albums-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .loading-container, .error-container, .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    text-align: center;

    p {
      margin-bottom: 1rem;
      color: var(--color-text-secondary);
    }
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(var(--color-primary-rgb), 0.3);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;

    .page-info {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .btn-pagination {
      padding: 0.5rem 1rem;
      background-color: var(--color-background-light);
      border: 1px solid var(--color-border);
      border-radius: 4px;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        background-color: var(--color-background);
      }
    }
  }

  .btn-secondary {
    padding: 0.75rem 1rem;
    background-color: var(--color-background-light);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background-color: var(--color-background);
    }
  }
  </style>