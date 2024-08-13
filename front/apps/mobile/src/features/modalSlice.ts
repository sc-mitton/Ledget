import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './store';

type Modal =
  'logout' |
  'editPersonalInfo' |
  'confirmRemoveCoOwner' |
  'addCoOwner' |
  { name: 'confirmDeletePlaidItem', args: { id: string } }

type FormatedModal<M extends Modal> = M extends { name: infer N, args?: infer A } ? { name: N, args: A } : { name: M }

const initialState: {
  modal?: FormatedModal<Modal>
} = {
  modal: undefined
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<Modal>) => {
      state.modal = typeof action.payload === 'string' ? { name: action.payload } : action.payload
    },
    clearModal: (state) => {
      state.modal = undefined
    }
  }
});

export const { setModal, clearModal } = modalSlice.actions;
export const selectModal = (state: RootState & { [key: string]: any }) => state.modal.modal;
