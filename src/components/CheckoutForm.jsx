import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState, useContext } from "react";
import useAxiosPublic from "../AxiosSecure";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Swal from "sweetalert2";
import { FaLock, FaCreditCard } from "react-icons/fa";

const CheckoutForm = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosPublic();
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosSecure.get(`/orders/${id}`).then((res) => {
      setOrder(res.data);
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

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      setLoading(false);
      return;
    }

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
      const paymentInfo = {
        email: user.email,
        transactionId: paymentIntent.id,
        price: order.price,
        orderId: id,
        date: new Date(),
        mealName: order.mealName,
      };

      await axiosSecure.post("/payments", paymentInfo);

      Swal.fire("Success", "Payment completed successfully!", "success");
      navigate("payment-success");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-orange-100 relative overflow-hidden">
        
        {/* Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg">
              <FaCreditCard size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Secure Checkout
              </h2>
              <p className="text-sm text-gray-500">
                Complete your payment safely
              </p>
            </div>
          </div>

          {/* Order Info */}
          <div className="mb-6 p-4 rounded-2xl bg-orange-50 border border-orange-100">
            <p className="text-sm text-gray-600">Meal</p>
            <h3 className="font-semibold text-gray-800">
              {order.mealName || "Loading..."}
            </h3>

            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-600 text-sm">Total Amount</span>
              <span className="text-xl font-bold text-orange-600">
                ৳ {order.price}
              </span>
            </div>
          </div>

          {/* Card Element */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 transition">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1f2937",
                      "::placeholder": {
                        color: "#9ca3af",
                      },
                    },
                    invalid: {
                      color: "#ef4444",
                    },
                  },
                }}
              />
            </div>

            {/* Pay Button */}
            <button
              disabled={!stripe || !clientSecret || loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing Payment..." : `Pay ৳ ${order.price}`}
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
            <FaLock className="text-orange-500" />
            Secured by Stripe • SSL Encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
