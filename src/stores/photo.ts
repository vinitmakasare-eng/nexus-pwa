import { defineStore } from 'pinia'

export interface CapturedPhoto {
    file?: File;
    preview: string;
}

export const PHOTO_POSITIONS = [
    'Front',
    'Rear',
    'Left',
    'Right',
    'Front Left',
    'Front Right',
    'Rear Left',
    'Rear Right',
];

const STORAGE_KEY = 'blaze_captured_photos';

export const usePhotoStore = defineStore('photo', {
    state: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const initialPhotos = stored ? JSON.parse(stored) : {};
        return {
            photos: initialPhotos as Record<string, CapturedPhoto>,
        }
    },

    getters: {
        capturedCount: (state) => Object.keys(state.photos).length,
        totalRequired: () => PHOTO_POSITIONS.length,
        isComplete: (state) => Object.keys(state.photos).length === PHOTO_POSITIONS.length,
        getPhotoByPosition: (state) => (position: string) => state.photos[position],
    },

    actions: {
        setPhoto(position: string, photo: CapturedPhoto) {
            // Note: Files cannot be stringified to localStorage easily.
            // In a real PWA we might use IndexedDB for the files.
            // For now, we persist the metadata/preview strings.
            if (this.photos[position]) {
                URL.revokeObjectURL(this.photos[position].preview);
            }
            this.photos[position] = photo;
            this.persist();
        },
        removePhoto(position: string) {
            if (this.photos[position]) {
                URL.revokeObjectURL(this.photos[position].preview);
                delete this.photos[position];
                this.persist();
            }
        },
        resetPhotos() {
            Object.values(this.photos).forEach(photo => URL.revokeObjectURL(photo.preview));
            this.photos = {};
            this.persist();
        },
        persist() {
            // We only persist the preview URLs which are blobs in this session
            // Ideally we'd store base64 or use IDB for actual persistence across sessions
            // For this PWA demo, we'll store the keys to know what's captured
            const persistenceObj = { ...this.photos };
            // Clear File objects as they aren't serializable
            Object.keys(persistenceObj).forEach(key => {
                if (persistenceObj[key]) {
                    delete (persistenceObj[key] as any).file;
                }
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(persistenceObj));
        }
    }
})
