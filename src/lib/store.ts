import { create } from 'zustand'

type ModalType = 
  | 'newAppointment'
  | 'logWeight'
  | 'logSymptom'
  | 'editAppointment'
  | 'addNote'; // Assuming 'addNote' is a valid modal type

interface ModalState {
  modals: Record<ModalType, boolean>;
  modalData: any; // Add a field to store data for the modal
  openModal: (type: ModalType, data?: any) => void; // Allow passing data
  closeModal: (type: ModalType) => void;
  toggleModal: (type: ModalType) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  modals: {
    logWeight: false,
    logSymptom: false,
    newAppointment: false,
    editAppointment: false,
  },
  openModal: (type) => set((state) => ({
    modals: { ...state.modals, [type]: true }
  })),
  closeModal: (type) => set((state) => ({
    modals: { ...state.modals, [type]: false }
  })),
  toggleModal: (type) => set((state) => ({
    modals: { ...state.modals, [type]: !state.modals[type] }
  })),
  modalData: null, // Initialize modalData
}));
