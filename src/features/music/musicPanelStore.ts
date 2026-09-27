import {create} from 'zustand';

type MusicPanelState = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

/** Whether the music panel is open. The header button and the "Music" word both drive it. */
export const useMusicPanelStore = create<MusicPanelState>()((set) => {
  return {
    isOpen: false,
    setOpen: (isOpen) => {
      set({isOpen});
    },
  };
});
