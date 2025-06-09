import { Ref } from 'vue'

export interface UserInfo {
  user_id?: string;
  admin_id?: string;
  user_account?: string;
  admin_account?: string;
  nickname?: string;
  admin_nickname?: string;
  [key: string]: any;
}

export interface UserStore {
  userInfo: Ref<UserInfo | null>;
  token: Ref<string>;
  userId: Ref<string>;
  userRole: Ref<string>;
  setUserInfo: (info: UserInfo) => void;
  setToken: (token: string) => void;
  setUserId: (id: string) => void;
  setUserRole: (role: string) => void;
  clearUserInfo: () => void;
  isLoggedIn: () => boolean;
}

declare const useUserStore: () => UserStore;
export default useUserStore; 