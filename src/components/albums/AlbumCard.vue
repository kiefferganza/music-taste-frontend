<template>
  <div class="album-card">
    <div class="album-image">
      <img
          :src="album.cover || '/placeholder-album.jpg'"
          :alt="`${album.name} by ${album.artist}`"
          class="album-cover"
      />
    </div>

    <div class="album-info">
      <h3 class="album-title">{{ album.name }}</h3>
      <p class="album-artist">{{ album.artist }}</p>

      <div class="votes-container">
        <div class="vote-section upvotes">
          <button
              @click="handleVote('upvote')"
              class="vote-btn upvote"
              :class="{ active: userVote === 'upvote', disabled: userVote }"
              aria-label="Upvote"
              :disabled="userVote==='upvote'"
          >
            <span class="vote-icon">👍</span>
          </button>
          <span class="vote-count positive">{{ album.upvotes || 0 }}</span>
        </div>

        <div class="vote-section downvotes">
          <button
              @click="handleVote('downvote')"
              class="vote-btn downvote"
              :class="{ active: userVote === 'downvote' }"
              aria-label="Downvote"
              :disabled="userVote==='downvote'"

          >
            <span class="vote-icon">👎</span>
          </button>
          <span class="vote-count negative">{{ album.downvotes || 0 }}</span>
        </div>
      </div>

      <button
          v-if="isAdmin"
          @click="$emit('delete', album.id)"
          class="delete-btn"
          aria-label="Delete album"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import type { Album } from '../../types/Album';

export default defineComponent({
  name: 'AlbumCard',
  props: {
    album: {
      type: Object as PropType<Album>,
      required: true
    }
  },
  emits: ['vote', 'delete'],
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const isAdmin = computed(() => authStore.isAdmin);

    // Create a local ref for the user's vote that will be persisted
    const userVote = ref<'upvote' | 'downvote' | null>(props.album.userVote || null);

    // Load the persisted vote from localStorage on component mount
    onMounted(() => {
      const savedVote = localStorage.getItem(`album-vote-${props.album.id}-user-${authStore.user.id}`);
      console.log(savedVote)
      if (savedVote === 'upvote' || savedVote === 'downvote') {
        userVote.value = savedVote;
      }
    });

    const handleVote = (voteType: 'upvote' | 'downvote') => {
      // If user already voted this way, they're toggling it off
      if (userVote.value === voteType) {
        // Remove the vote
        userVote.value = null;
        localStorage.removeItem(`album-vote-${props.album.id}-user-${authstore.user.id}`);
      } else {
        // Set the new vote
        userVote.value = voteType;
        localStorage.setItem(`album-vote-${props.album.id}-user-${authStore.user.id}`, voteType);
      }

      // Emit the vote event to update the backend
      emit('vote', props.album.id, userVote.value);
    };

    return {
      isAdmin,
      handleVote,
      userVote
    };
  }
});
</script>

<style lang="scss" scoped>
.album-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.album-image {
  position: relative;
  padding-top: 100%; // 1:1 aspect ratio
  overflow: hidden;

  .album-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover .album-cover {
    transform: scale(1.05);
  }
}

.album-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.album-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
  line-height: 1.3;
}

.album-artist {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.votes-container {
  display: flex;
  justify-content: space-around;
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: var(--color-background-alt, #f8f8f8);
  border-radius: 6px;
}

.vote-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.vote-count {
  font-weight: 600;
  font-size: 1rem;

  &.positive {
    color: var(--color-success);
  }

  &.negative {
    color: var(--color-error);
  }
}

.vote-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  .vote-icon {
    font-size: 1rem;
  }

  &.upvote {
    &:hover {
      background-color: rgba(var(--color-success-rgb), 0.1);
      border-color: var(--color-success);
      transform: translateY(-2px);
    }

    &.active {
      background-color: var(--color-success);
      border-color: var(--color-success);
      transform: translateY(-2px);
    }
  }

  &.downvote {
    &:hover {
      background-color: rgba(var(--color-error-rgb), 0.1);
      border-color: var(--color-error);
      transform: translateY(2px);
    }

    &.active {
      background-color: var(--color-error);
      border-color: var(--color-error);
      transform: translateY(2px);
    }
  }
}

.delete-btn {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(var(--color-error-rgb), 0.1);
  color: var(--color-error);
  border: 1px solid var(--color-error);
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-error);
    color: white;
  }
}
</style>