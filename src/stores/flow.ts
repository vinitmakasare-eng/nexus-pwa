import { defineStore } from 'pinia'
import { useClientStore } from './client'

const STORAGE_KEY = 'blaze_flow_state';

export const useFlowStore = defineStore('flow', {
    state: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return {
            currentStepIndex: stored ? parseInt(stored) : 0,
        }
    },

    getters: {
        currentStepId: (state) => {
            const clientStore = useClientStore();
            return clientStore.flowSteps[state.currentStepIndex];
        },
        isFirstStep: (state) => state.currentStepIndex === 0,
        isLastStep: (state) => {
            const clientStore = useClientStore();
            return state.currentStepIndex === clientStore.flowSteps.length - 1;
        },
        progress: (state) => {
            const clientStore = useClientStore();
            if (clientStore.flowSteps.length === 0) return 0;
            return (state.currentStepIndex / (clientStore.flowSteps.length - 1)) * 100;
        },
        totalSteps: () => {
            const clientStore = useClientStore();
            return clientStore.flowSteps.length;
        }
    },

    actions: {
        nextStep() {
            if (!this.isLastStep) {
                this.currentStepIndex++;
                this.persist();
            }
        },
        prevStep() {
            if (!this.isFirstStep) {
                this.currentStepIndex--;
                this.persist();
            }
        },
        resetFlow() {
            this.currentStepIndex = 0;
            this.persist();
        },
        setStep(index: number) {
            const clientStore = useClientStore();
            if (index >= 0 && index < clientStore.flowSteps.length) {
                this.currentStepIndex = index;
                this.persist();
            }
        },
        persist() {
            localStorage.setItem(STORAGE_KEY, this.currentStepIndex.toString());
        }
    }
})
