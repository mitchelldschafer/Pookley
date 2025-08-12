import React from 'react';
import { X, Check, Crown, Star, Zap } from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
  currentTier: 'free' | 'pro' | 'premium';
  onTierChange: (tier: 'free' | 'pro' | 'premium') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, currentTier, onTierChange }) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out our apps',
      icon: Zap,
      color: 'bg-gray-500',
      features: [
        'Access to 4 free apps',
        'Basic support',
        'Community access',
        'Mobile responsive apps'
      ],
      limitations: [
        'Limited app selection',
        'No premium features',
        'Community support only'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9',
      period: 'per month',
      description: 'Great for professionals and power users',
      icon: Star,
      color: 'bg-blue-500',
      popular: true,
      features: [
        'Access to all free + pro apps',
        'Priority support',
        'Advanced features',
        'Export functionality',
        'Custom themes',
        'API access',
        'Weekly updates'
      ],
      limitations: [
        'No premium-tier apps'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19',
      period: 'per month',
      description: 'Complete access to everything',
      icon: Crown,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      features: [
        'Access to ALL apps',
        'Premium support',
        'Early access to new apps',
        'Custom integrations',
        'White-label options',
        'Advanced analytics',
        'Priority feature requests',
        'Direct developer contact'
      ],
      limitations: []
    }
  ];

  const handleSelectPlan = (planId: string) => {
    onTierChange(planId as 'free' | 'pro' | 'premium');
    // In a real app, this would trigger payment processing
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Unlock the full potential of Pookley's app collection
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentTier === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-gray-700 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? 'border-blue-500 shadow-xl'
                      : isCurrentPlan
                      ? 'border-green-500 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Current</span>
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 ${plan.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {plan.name}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                          {plan.price}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {plan.description}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center space-x-3 opacity-60">
                          <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrentPlan}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                        isCurrentPlan
                          ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105'
                          : 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900'
                      }`}
                    >
                      {isCurrentPlan ? 'Current Plan' : `Choose ${plan.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Why Choose Pookley?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Premium Quality
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Every app is crafted with attention to detail and modern design principles.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Regular Updates
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      New apps and features added regularly based on user feedback.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Dedicated Support
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Get help when you need it with our responsive support team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};