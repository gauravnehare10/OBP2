import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      userdata: {},
      updateUserData: (userdata) => set({ userdata: userdata }),
    }),
    {
      name: 'user',
    },
  ),
)

export default useStore;