import toast, { Toaster } from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        duration: 4000,
        position: 'top-center',
        style: {
            background: '#0a0a0a',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #262626',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        },
        iconTheme: {
            primary: '#10b981',
            secondary: '#0a0a0a',
        },
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        duration: 5000,
        position: 'top-center',
        style: {
            background: '#0a0a0a',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #262626',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        },
        iconTheme: {
            primary: '#ef4444',
            secondary: '#0a0a0a',
        },
    });
};

export const showInfoToast = (message: string) => {
    toast(message, {
        duration: 4000,
        position: 'top-center',
        icon: '📧',
        style: {
            background: '#0a0a0a',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #262626',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        },
    });
};

export { Toaster };
