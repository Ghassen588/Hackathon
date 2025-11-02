import { useState } from "react";

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "$0",
      period: "forever",
      icon: "🎯",
      features: [
        "Small area coverage (up to 1 acre)",
        "Basic soil monitoring",
        "Weather forecasts",
        "3 irrigation zones",
        "Community support",
      ],
      buttonText: "Current Plan",
      buttonVariant: "bg-gray-500 hover:bg-gray-600",
      popular: false,
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: "$10",
      period: "per month",
      icon: "🚀",
      features: [
        "Wide area coverage (up to 10 acres)",
        "Advanced soil analytics",
        "Detailed weather insights",
        "Unlimited irrigation zones",
        "Priority support",
        "Mobile app access",
        "Historical data analysis",
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "bg-green-500 hover:bg-green-600",
      popular: true,
    },
  ];

  const handlePlanSelect = async (planId: any) => {
    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (planId === "premium") {
        alert("🎉 Upgrade successful! Welcome to Premium!");
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 flex items-center justify-center">
      <div className="mt-6 bg-white rounded-2xl p-8 shadow-2xl border-2 border-gray-100 max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
          <span className="text-4xl">💰</span>
          Choose Your Plan
        </h2>
        <p className="text-gray-600 text-lg mb-8 text-center">
          Select the plan that works best for your farming needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border-2 transition duration-300 transform hover:scale-105 ${
                plan.popular ? "border-green-300 shadow-2xl" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={isProcessing || plan.id === "free"}
                className={`w-full text-xl font-bold text-white py-4 px-6 rounded-lg shadow-lg transition duration-300 ${
                  plan.id === "free"
                    ? "bg-gray-400 cursor-not-allowed"
                    : plan.buttonVariant
                } ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-xl"
                }`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </span>
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>💡 All plans include our core irrigation management features</p>
          <p className="text-sm mt-2">Cancel or change your plan anytime</p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
