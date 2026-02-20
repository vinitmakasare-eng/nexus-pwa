import { defineStore } from 'pinia'

export interface VehicleDetails {
    vin: string;
    make: string;
    model: string;
    year: string;
    color: string;
    mileage: string;
    licensePlate: string;
}

const STORAGE_KEY = 'blaze_vehicle_details';

export const useDetailStore = defineStore('detail', {
    state: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return {
            details: stored ? JSON.parse(stored) : {
                vin: '',
                make: '',
                model: '',
                year: '',
                color: '',
                mileage: '',
                licensePlate: '',
            } as VehicleDetails,
        }
    },

    actions: {
        updateDetails(updates: Partial<VehicleDetails>) {
            this.details = { ...this.details, ...updates };
            this.persist();
        },
        resetVehicle() {
            this.details = {
                vin: '',
                make: '',
                model: '',
                year: '',
                color: '',
                mileage: '',
                licensePlate: '',
            };
            this.persist();
        },
        persist() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.details));
        }
    }
})
