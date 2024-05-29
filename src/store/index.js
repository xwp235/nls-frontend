import { defineStore } from 'pinia'
import storage from 'good-storage'

const MEMBER = 'member'

export const useMemberStore = defineStore(MEMBER, {
    state: () => ({
        member: storage.session.get(MEMBER) || {}
    }),
    actions: {
        saveMember(member) {
            this.member = member
            storage.session.set(MEMBER, member)
        }
    }
})
