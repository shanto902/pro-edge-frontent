import {
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { BsCurrencyDollar } from "react-icons/bs";

const PaymentSection = forwardRef(({ onPaymentSuccess, onPaymentError, email, orderSummary }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canUseWallets, setCanUseWallets] = useState(false);

  // Initialize payment request for Google/Apple Pay
  useEffect(() => {
    if (!stripe || !orderSummary?.total) return;

    const pr = stripe.paymentRequest({
      country: 'US', // Adjust based on your market
      currency: orderSummary.currency || 'usd',
      total: {
        label: 'Total',
        amount: Math.round(orderSummary.total * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if browser supports payment request API
    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr);
        setCanUseWallets(true);
      }
    });

    pr.on('paymentmethod', async (evt) => {
      setProcessing(true);
      try {
        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin,
            receipt_email: email,
          },
          payment_method: evt.paymentMethod.id,
        });

        if (confirmError) throw confirmError;
        evt.complete('success');
        onPaymentSuccess(evt.paymentIntent);
      } catch (err) {
        evt.complete('fail');
        setError(err.message);
        onPaymentError(err);
      } finally {
        setProcessing(false);
      }
    });
  }, [stripe, orderSummary, email]);

  useImperativeHandle(ref, () => ({
    submitPayment: async () => {
      return await handleSubmit();
    }
  }));

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      const message = "Payment system not ready. Please try again.";
      setError(message);
      return { success: false, message };
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: email,
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (stripeError) throw stripeError;

      if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent);
        return { success: true, paymentIntent };
      }
      throw new Error("Payment processing failed. Please try again.");
    } catch (err) {
      setError(err.message);
      onPaymentError(err);
      return { success: false, message: err.message };
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-section">
      <h1 className="text-[#182B55] text-xl md:text-3xl font-semibold mb-4">
         Payment
      </h1>

      {orderSummary && (
        <div className="order-summary mb-6">
          <h3 className="text-lg font-semibold mb-2">Order Total</h3>
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span className="flex gap-x-2 items-center"><BsCurrencyDollar/>{orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shipping:</span>
            <span className="flex gap-x-2 items-center"><BsCurrencyDollar/>{orderSummary.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span className="flex gap-x-2 items-center"><BsCurrencyDollar/>{orderSummary.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Wallet Payment Buttons (Apple Pay/Google Pay) */}
      {canUseWallets && paymentRequest && (
        <div className="mb-6">
          <PaymentRequestButtonElement
            options={{ paymentRequest }}
            className="w-full"
          />
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>
      )}

      {/* Stripe Payment Element */}
      <PaymentElement
        options={{
          layout: {
            type: 'tabs', // Shows all payment methods as tabs
            defaultCollapsed: false,
          },
          wallets: {
            applePay: 'auto',
            googlePay: 'auto'
          },
         
        }}
      />

    

      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md mt-4">
          {error}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Your payment is securely processed by Stripe. We don't store your card details.
      </div>
    </div>
  );
});

export default PaymentSection;