export {}
declare global {
  interface Window {
    onPaymentSuccess: (res: unknown) => void;
    onPaymentError: (err: unknown) => void;
    NetPay: unknown;
  }
}
