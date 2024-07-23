import { createSlice } from "@reduxjs/toolkit";
import { RootState } from './store';

type Modals = 'logout'

interface ModalState {
  modal?: Modals
}

const initialState: ModalState = {
  modal: undefined
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modal = action.payload
    },
    clearModal: (state) => {
      state.modal = undefined
    }
  }
});

export const { setModal, clearModal } = modalSlice.actions;
export const selectModal = (state: RootState & { [key: string]: any }) => state.modal.modal;
