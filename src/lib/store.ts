import { create } from 'zustand'

type ModalType = 
  | 'newAppointment' 
  | 'logWeight' 
  | 'logSymptom'
 | 'editAppointment'
  | 'addNote'; // Assuming 'addNote' is a valid modal type

interface ModalState {
  modals: Record<ModalType, boolean>;
  openModal: (type: ModalType) => void;
  closeModal: (type: ModalType) => void;
  toggleModal: (type: ModalType) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  modals: {
    newAppointment: false,
    logWeight: false,
    logSymptom: false,
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
}));
