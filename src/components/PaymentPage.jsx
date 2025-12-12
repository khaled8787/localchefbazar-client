import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// ---------------- PAYMENT FORM COMPONENT ----------------
const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosPublic();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  // Create Payment Intent
  useEffect(() => {
    if (order?.price) {
      axiosSecure
        .post("/create-payment-intent", { price: order.price })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [order, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
          billing_details: {
            email: user?.email,
            name: user?.displayName,
          },
        },
      }
    );

    if (error) {
      Swal.fire("Error", error.message, "error");
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // Save Payment History
      const paymentData = {
        orderId: order._id,
        userEmail: user?.email,
        amount: order.price,
        transactionId: paymentIntent.id,
        date: new Date(),
      };

      await axiosSecure.post("/payments", paymentData);

      // Update Order Status
      await axiosSecure.patch(`/orders/${order._id}/pay`, {
        paymentStatus: "paid",
      });

      Swal.fire("Success", "Payment completed!", "success");
      navigate(`/payment-success?transactionId=${paymentIntent.id}`);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-xl space-y-4"
    >
      <CardElement className="p-4 border rounded-xl" />

      <button
        disabled={!stripe || !clientSecret || loading}
        className="btn w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl mt-3"
      >
        {loading ? "Processing..." : `Pay $${order.price}`}
      </button>
    </form>
  );
};

// ---------------- PAYMENT PAGE WRAPPER ----------------
const PaymentPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosPublic();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id, axiosSecure]);

  if (!order)
    return <div className="text-center py-20 text-xl">Loading payment...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-4xl font-bold text-center text-orange-600 mb-8">
        Complete Your Payment
      </h2>

      <Elements stripe={stripePromise}>
        <CheckoutForm order={order} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
