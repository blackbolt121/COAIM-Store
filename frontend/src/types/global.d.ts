export {}
declare global {
  interface Window {
    onPaymentSuccess: (res: any) => void;
    onPaymentError: (err: any) => void;
    NetPay: any;
  }
}