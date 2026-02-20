import { defineStore } from 'pinia'

export interface RecordedVideo {
    file?: File;
    preview: string;
    duration: number;
}

const STORAGE_KEY = 'blaze_recorded_videos';

export const useVideoStore = defineStore('video', {
    state: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const initialVideos = stored ? JSON.parse(stored) : {};
        return {
            videos: initialVideos as Record<string, RecordedVideo>,
            isRecording: false,
        }
    },

    getters: {
        videoCount: (state) => Object.keys(state.videos).length,
        getVideoByPosition: (state) => (id: string) => state.videos[id],
    },

    actions: {
        setVideo(id: string, video: RecordedVideo) {
            if (this.videos[id]) {
                URL.revokeObjectURL(this.videos[id].preview);
            }
            this.videos[id] = video;
            this.persist();
        },
        removeVideo(id: string) {
            if (this.videos[id]) {
                URL.revokeObjectURL(this.videos[id].preview);
                delete this.videos[id];
                this.persist();
            }
        },
        setRecordingStatus(status: boolean) {
            this.isRecording = status;
        },
        resetVideos() {
            Object.values(this.videos).forEach(video => URL.revokeObjectURL(video.preview));
            this.videos = {};
            this.persist();
        },
        persist() {
            const persistenceObj = { ...this.videos };
            Object.keys(persistenceObj).forEach(key => {
                if (persistenceObj[key]) {
                    delete (persistenceObj[key] as any).file;
                }
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(persistenceObj));
        }
    }
})
