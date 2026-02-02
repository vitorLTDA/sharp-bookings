import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Barber, TimeSlot } from '@/lib/mockData';

interface BookingState {
  selectedBarber: Barber | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

interface BookingContextType {
  booking: BookingState;
  setSelectedBarber: (barber: Barber | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setCustomerInfo: (name: string, phone: string, email: string) => void;
  resetBooking: () => void;
}

const initialState: BookingState = {
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(initialState);

  const setSelectedBarber = (barber: Barber | null) => {
    setBooking((prev) => ({ ...prev, selectedBarber: barber }));
  };

  const setSelectedDate = (date: Date | null) => {
    setBooking((prev) => ({ ...prev, selectedDate: date, selectedTime: null }));
  };

  const setSelectedTime = (time: string | null) => {
    setBooking((prev) => ({ ...prev, selectedTime: time }));
  };

  const setCustomerInfo = (name: string, phone: string, email: string) => {
    setBooking((prev) => ({
      ...prev,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
    }));
  };

  const resetBooking = () => {
    setBooking(initialState);
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setSelectedBarber,
        setSelectedDate,
        setSelectedTime,
        setCustomerInfo,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
