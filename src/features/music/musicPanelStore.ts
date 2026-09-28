import {create} from 'zustand';

type MusicPanelState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useMusicPanelStore = create<MusicPanelState>()((set) => ({
  open: false,
  setOpen: (open) => set({open}),
}));
