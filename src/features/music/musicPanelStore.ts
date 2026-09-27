import {create} from 'zustand';

type MusicPanelState = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useMusicPanelStore = create<MusicPanelState>()((set) => {
  return {
    isOpen: false,
    setOpen: (isOpen) => {
      set({isOpen});
    },
  };
});
