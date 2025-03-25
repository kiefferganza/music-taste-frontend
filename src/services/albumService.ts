import api from './api';

export const albumService = {
  async getAlbums(page = 1, search = '') {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/albums?${params.toString()}`);
    return response.data;
  },

  async voteOnAlbum(albumId: number, voteType: 'upvote' | 'downvote') {
    const response = await api.post(`/album/${albumId}/vote`, { value: voteType });
    return response.data;
  },

  async deleteAlbum(albumId: number) {
    const response = await api.delete(`/albums/${albumId}`);
    return response.data;
  }
};