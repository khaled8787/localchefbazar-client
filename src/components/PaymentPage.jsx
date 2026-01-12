import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosPublic();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order?.price) {
      axiosSecure
        .post("/create-payment-intent", { price: order.price })
        .then((res) => setClientSecret(res.data.clientSecret));
    }
  }, [order, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email: user?.email,
          name: user?.displayName,
        },
      },
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const paymentData = {
        orderId: order._id,
        userEmail: user?.email,
        amount: order.price,
        transactionId: paymentIntent.id,
        date: new Date(),
      };

      await axiosSecure.post("/payments", paymentData);

      await axiosSecure.patch(`/orders/${order._id}/pay`, { paymentStatus: "paid" });

      Swal.fire("Success", "Payment completed!", "success");
      navigate(`/payment-success?transactionId=${paymentIntent.id}`);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-xl space-y-5 max-w-md mx-auto"
    >
      <h3 className="text-2xl font-bold text-orange-500 text-center mb-4">
        Pay for {order.mealName}
      </h3>

      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#333",
              "::placeholder": { color: "#a1a1aa" },
            },
            invalid: { color: "#f87171" },
          },
        }}
        className="p-4 border rounded-xl bg-gray-50"
      />

      <button
        disabled={!stripe || !clientSecret || loading}
        className="btn w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 font-semibold"
      >
        {loading ? "Processing..." : `Pay $${order.price}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosPublic();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id, axiosSecure]);

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-orange-500 text-xl">
        Loading payment...
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center px-4 py-10">
      <h2 className="text-4xl md:text-5xl font-bold text-orange-600 mb-10 text-center">
        Complete Your Payment
      </h2>

      <Elements stripe={stripePromise}>
        <CheckoutForm order={order} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
