import React, { createContext, useContext, useState, useCallback } from "react";

interface BookingModalState {
  isOpen: boolean;
  calendarUrl: string;
  showNoShowPolicy: boolean;
}

interface BookingModalContextType {
  state: BookingModalState;
  openBookingModal: (calendarUrl: string, showNoShowPolicy?: boolean) => void;
  closeBookingModal: () => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingModalState>({
    isOpen: false,
    calendarUrl: "",
    showNoShowPolicy: true,
  });

  const openBookingModal = useCallback((calendarUrl: string, showNoShowPolicy: boolean = true) => {
    setState({
      isOpen: true,
      calendarUrl,
      showNoShowPolicy,
    });
  }, []);

  const closeBookingModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  return (
    <BookingModalContext.Provider value={{ state, openBookingModal, closeBookingModal }}>
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (context === undefined) {
    throw new Error("useBookingModal must be used within a BookingModalProvider");
  }
  return context;
}
