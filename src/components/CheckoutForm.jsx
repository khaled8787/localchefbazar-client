import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState, useContext } from "react";
import useAxiosPublic from "../AxiosSecure";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Swal from "sweetalert2";

const CheckoutForm = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosPublic();
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams(); // orderId
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);

  // Load order info
  useEffect(() => {
    axiosSecure.get(`/orders/${id}`).then((res) => {
      setOrder(res.data);

      // create payment intent
      axiosSecure
        .post("/create-payment-intent", { price: res.data.price })
        .then((res) => setClientSecret(res.data.clientSecret));
    });
  }, [id, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    // create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      setLoading(false);
      return;
    }

    // confirm payment
    const { paymentIntent, error: intentError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

    if (intentError) {
      Swal.fire("Error", intentError.message, "error");
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // save payment to backend
      const paymentInfo = {
        email: user.email,
        transactionId: paymentIntent.id,
        price: order.price,
        orderId: id,
        date: new Date(),
        mealName: order.mealName,
      };

      await axiosSecure.post("/payments", paymentInfo);

      Swal.fire("Success", "Payment completed!", "success");
      navigate("payment-success");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        className="p-4 border rounded-xl bg-gray-50"
        options={{
          style: {
            base: {
              fontSize: "18px",
              color: "#333",
            },
          },
        }}
      />

      <button
        disabled={!stripe || !clientSecret || loading}
        className="btn w-full mt-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
