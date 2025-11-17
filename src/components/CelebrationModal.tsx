import React, { useEffect, useState } from 'react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: number;
  message?: string;
  title?: string;
}

/**
 * Celebration Modal Component for milestone achievements
 */
export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  milestone,
  message,
  title
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMilestoneTitle = (milestone: number) => {
    if (milestone === 100) return "🎉 Goal Complete!";
    if (milestone >= 75) return "🏆 Major Milestone!";
    if (milestone >= 50) return "🎊 Halfway There!";
    if (milestone >= 25) return "⭐ First Quarter!";
    return "🎯 Progress Made!";
  };

  const getMilestoneMessage = (milestone: number) => {
    if (milestone === 100) return "Congratulations! You've completed your entire goal. This is an incredible achievement!";
    if (milestone >= 75) return "Amazing progress! You're in the final stretch of your journey.";
    if (milestone >= 50) return "Halfway there! Your dedication is paying off.";
    if (milestone >= 25) return "Great start! Keep up the momentum.";
    return "Every step forward is a victory. Keep going!";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Confetti background effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 opacity-10 animate-pulse"></div>

        {/* Trophy icon with animation */}
        <div className="relative mb-6">
          <div className="text-6xl animate-bounce">
            {milestone === 100 ? '🏆' : milestone >= 75 ? '🎖️' : milestone >= 50 ? '🎊' : milestone >= 25 ? '⭐' : '🎯'}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 relative">
          {title || getMilestoneTitle(milestone)}
        </h2>

        <p className="text-gray-600 mb-6 relative">
          {message || getMilestoneMessage(milestone)}
        </p>

        {/* Progress indicator */}
        <div className="mb-6 relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${milestone}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm font-semibold text-gray-700">
            {milestone}% Complete
          </div>
        </div>

        {/* Motivational quote */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 relative">
          <p className="text-sm italic text-gray-700">
            "{milestone === 100
              ? 'The journey of a thousand miles begins with a single step, and you\'ve completed the entire journey!'
              : 'Success is not final, failure is not fatal: It is the courage to continue that counts.'
            }"
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Continue Journey
        </button>
      </div>
    </div>
  );
};

/**
 * Achievement Badge Component
 */
interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  icon,
  earned,
  earnedDate,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
          earned
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white transform scale-110'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        {icon}
      </div>

      {earned && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      <div className="mt-2 text-center">
        <p className={`text-sm font-semibold ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
          {title}
        </p>
        <p className={`text-xs ${earned ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
        {earned && earnedDate && (
          <p className="text-xs text-green-600 mt-1">
            Earned {earnedDate.toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};
