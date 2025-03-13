import { createSlice } from "@reduxjs/toolkit";

interface EmailItem {
    id: string;
    to: string;
    subject: string;
    body: string;
    timestamp: string;
    status: 'draft' | 'sent';
}

interface MailsState {
    emails: EmailItem[];
}

const initialState: MailsState = {
    emails: [],
};

const mailsSlice = createSlice({
    name: "mails",
    initialState,
    reducers: {
        setEmails: (state, action) => {
            state.emails = action.payload;
        },
        addEmail: (state, action) => {
            state.emails.push(action.payload);
        },
        updateEmail: (state, action) => {
            const index = state.emails.findIndex(email => email.id === action.payload.id);
            if (index !== -1) {
                state.emails[index] = action.payload;
            }
        },
        clearEmails: (state) => {
            state.emails = [];
        }
    },
});

export const { setEmails, addEmail, updateEmail, clearEmails } = mailsSlice.actions;

export const selectEmails = (state: { mails: MailsState }) => state.mails.emails;
export const selectEmailById = (id: string) => (state: { mails: MailsState }) =>
    state.mails.emails.find(email => email.id === id);
export const selectEmailsByStatus = (status: 'draft' | 'sent') => (state: { mails: MailsState }) =>
    state.mails.emails.filter(email => email.status === status);

export default mailsSlice.reducer;

