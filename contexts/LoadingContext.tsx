import { LoadingSpinner } from '@/components/LoadingSpinner'; // your animated icon version
import React, { createContext, useContext, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  message?: string;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
  message: '',
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const showLoading = (msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setMessage(undefined);
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, showLoading, hideLoading, message }}
    >
      <>
        {children}
        {isLoading && (
          <Modal visible transparent animationType="fade">
            <View style={styles.overlay}>
              <LoadingSpinner text={message} />
            </View>
          </Modal>
        )}
      </>
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
