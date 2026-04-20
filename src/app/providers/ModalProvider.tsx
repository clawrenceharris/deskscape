"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { Dialog } from '@/components/ui';
import { ModalProps, modalRegistry, ModalState, ModalType } from '@/lib/modals';
import { registerProfileModals } from '@/features/profile/presentation/components/modals';
import { registerDeskModals } from '@/features/desk/presentation/components/modals';
import { registerNotebookModals } from '@/features/notebook/presentation/components/modals';

interface ModalContextType {
  openModal: <T extends ModalProps>(type: ModalType, props: T) => void;
  updateModalProps: <T extends ModalProps>(updates: Partial<T>) => void;
  closeModal: () => void;
  isOpen: boolean;
  currentModalType: ModalType | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    props: null,
  });

  const closeModal = useCallback(() => {
    setModalState({ type: null, props: null });
  }, []);

  const updateModalProps = useCallback(
    <T extends ModalProps>(updates: Partial<T>) => {
      setModalState((prev) => {
        if (!prev.type || !prev.props) return prev;
        const newProps = { ...prev.props, ...updates } as ModalProps;
        return {
          ...prev,
          props: newProps,
        };
      });
    },
    []
  );

  const openModal = useCallback(
    <T extends ModalProps>(type: ModalType, props: T) => {
      if (!modalRegistry.has(type)) {
        console.error(`Modal type "${type}" is not registered.`);
        return;
      }

      setModalState({ type, props });
    },
    []
  );

  const value = useMemo<ModalContextType>(
    () => ({
      openModal,
      updateModalProps,
      closeModal,
      isOpen: modalState.type !== null,
      currentModalType: modalState.type,
    }),
    [openModal, updateModalProps, closeModal, modalState.type]
  );

  // Render the modal component
  const modalContent =
    modalState.type && modalState.props
      ? (() => {
          const Component = modalRegistry.getComponent(modalState.type);
          if (!Component) {
            console.error(
              `No component found for modal type: ${modalState.type}`
            );
            return null;
          }
          // Modal components render DialogContent which includes DialogPortal,
          // so we need to wrap in Dialog root
          return (
            <Dialog open={true} onOpenChange={closeModal}>
              <Component {...modalState.props} />
            </Dialog>
          );
        })()
      : null;

  const modalPortal =
    modalState.type && modalContent
      ? createPortal(modalContent, document.body)
      : null;

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalPortal}
      <ModalRegistration/>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}


/**
 * Component that registers all modals on mount
 * Should be placed inside ModalProvider
 */
export function ModalRegistration() {
  useEffect(() => {
    registerProfileModals();
    registerDeskModals();
    registerNotebookModals();
  }, []);

  return null;
}