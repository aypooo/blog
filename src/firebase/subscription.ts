import { ref, push, onValue, set, remove, update } from 'firebase/database';
import { db } from './firebase';
// import { subscribedUsersState } from '../recoil/atoms';

export function subscribeUser(userId: string, subscriberId: string): void {
  const userRef: { [key: string]: any } = {};
  userRef['users/' + userId + '/follow/' + subscriberId] = true; 
  const subscriberRef: { [key: string]: any } = {};
  subscriberRef['users/' + subscriberId + '/follower/' + userId] = true; 

  try {
    update(ref(db), userRef);
    update(ref(db), subscriberRef);
  } catch (error) {
    console.error('구독 실패: ', error);
    throw error;
  }
}
export function unsubscribeUser(userId: string, subscriberId: string): void {
    const userRef: { [key: string]: any } = {};
    userRef['users/' + userId + '/follow/' + subscriberId] = null;
  
    const subscriberRef: { [key: string]: any } = {};
    subscriberRef['users/' + subscriberId + '/follower/' + userId] = null;
  
    try {
      update(ref(db), userRef);
      update(ref(db), subscriberRef);
    } catch (error) {
      console.error('구독 해제 실패: ', error);
      throw error;
    }
  
  }