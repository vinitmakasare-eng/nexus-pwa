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

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
export const usePhotoStore = defineStore('photo', {
    state: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        let initialPhotos = {};
        try {
            initialPhotos = stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("Failed to parse photos", e);
        }

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
        async setPhoto(position: string, photo: CapturedPhoto) {
            if (this.photos[position]?.preview.startsWith('blob:')) {
                URL.revokeObjectURL(this.photos[position].preview);
            }

            // If a File exists, generate a Base64 version for persistence
            let persistentPreview = photo.preview;
            if (photo.file) {
                persistentPreview = await blobToBase64(photo.file);
            }

            this.photos[position] = {
                ...photo,
                preview: persistentPreview // Store the Base64 version
            };
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
            // Now it's safe to stringify because preview is a Base64 string, not a Blob URL
            const dataToSave = JSON.parse(JSON.stringify(this.photos));
            // Ensure we don't try to stringify the File object
            Object.keys(dataToSave).forEach(key => {
                delete dataToSave[key].file;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        }
    }
})
