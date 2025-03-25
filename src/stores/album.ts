import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { albumService } from '../services/albumService';
import type { Album } from '../types/Album';

export const useAlbumStore = defineStore('albums', () => {
  const albums = ref<Album[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchQuery = ref('');

  // Computed properties for filtered and sorted albums
  const sortedAlbums = computed(() => {
    return [...albums.value].sort((a, b) => {
      // First sort by votes (descending)
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      // Then sort alphabetically by song name
      return a.name.localeCompare(b.name);
    });
  });

  const filteredAlbums = computed(() => {
    if (!searchQuery.value) return sortedAlbums.value;

    const query = searchQuery.value.toLowerCase();
    return sortedAlbums.value.filter(album =>
      album.name.toLowerCase().includes(query) ||
      album.artist.toLowerCase().includes(query)
    );
  });

  async function fetchAlbums(page = 1, search = '') {
    try {
      loading.value = true;
      error.value = null;

      const response = await albumService.getAlbums(page, search);
      albums.value = response.data;
      currentPage.value = response.current_page;
      totalPages.value = response.last_page;

      return response;
    } catch (err: any) {
      console.error('Failed to fetch albums:', err);
      error.value = err.message || 'Failed to load albums. Please try again.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function voteOnAlbum(albumId: number, voteType: 'upvote' | 'downvote') {
    try {
      loading.value = true;
      error.value = null;

      const response = await albumService.voteOnAlbum(albumId, voteType);
      console.log(response, 'response');
      // Update the album in our local state
      const albumIndex = albums.value.findIndex(a => a.id === albumId);
      if (albumIndex !== -1) {
        // Update the votes count and user's vote
        albums.value[albumIndex] = {
          ...response.data,
        };

        console.log(albums.value[albumIndex]);
      }

      return response;
    } catch (err: any) {
      console.error('Failed to vote on album:', err);
      error.value = err.message || 'Failed to vote. Please try again.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteAlbum(albumId: number) {
    try {
      loading.value = true;
      error.value = null;

      await albumService.deleteAlbum(albumId);

      // Remove the album from our local state
      albums.value = albums.value.filter(a => a.id !== albumId);

      return true;
    } catch (err: any) {
      console.error('Failed to delete album:', err);
      error.value = err.message || 'Failed to delete album. Please try again.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
    // Reset to first page when searching
    currentPage.value = 1;
  }

  return {
    albums,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    sortedAlbums,
    filteredAlbums,
    fetchAlbums,
    voteOnAlbum,
    deleteAlbum,
    setSearchQuery
  };
});