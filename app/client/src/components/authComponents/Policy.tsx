import { X } from 'lucide-react';

interface PolicyPopupProps {
  onClose: () => void;
}

export function PolicyPopup({ onClose }: PolicyPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-purple-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div 
          className="bg-white/25 backdrop-blur-2xl rounded-3xl max-h-[80vh] p-10 shadow-2xl shadow-purple-900/10 flex flex-col"
          style={{
            boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-gray-900">
              Terms & Privacy Policy
            </h1>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-white/30 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-gray-900 mb-3">Terms of Service</h2>
                <p className="mb-4">
                  Welcome to JobMatching Hub. By accessing or using our service, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
                <p className="mb-4">
                  Our platform connects job seekers with relevant opportunities based on their skills and preferences. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                <p className="mb-4">
                  You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                </p>
              </section>

              <section>
                <h2 className="text-gray-900 mb-3">Privacy Policy</h2>
                <p className="mb-4">
                  Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
                <p className="mb-4">
                  <strong>Information We Collect:</strong> We collect information that you provide directly to us, including your name, email address, password, professional background, skills, and job preferences.
                </p>
                <p className="mb-4">
                  <strong>How We Use Your Information:</strong> We use the information we collect to provide, maintain, and improve our services, to match you with relevant job opportunities, and to communicate with you about your account and our services.
                </p>
                <p className="mb-4">
                  <strong>Data Security:</strong> We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p className="mb-4">
                  <strong>Data Sharing:</strong> We do not sell your personal information. We may share your information with potential employers only when you explicitly apply for a position or express interest in an opportunity.
                </p>
              </section>

              <section>
                <h2 className="text-gray-900 mb-3">Your Rights</h2>
                <p className="mb-4">
                  You have the right to access, correct, or delete your personal information at any time through your account settings. You may also request a copy of your data or ask us to stop processing your information.
                </p>
                <p className="mb-4">
                  You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or by adjusting your notification preferences in your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-gray-900 mb-3">Contact Us</h2>
                <p>
                  If you have any questions about these Terms or our Privacy Policy, please contact us at support@jobmatchinghub.com
                </p>
              </section>

              <section className="mt-8 pt-6 border-t border-white/30">
                <p className="text-gray-600">
                  Last updated: November 22, 2025
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
