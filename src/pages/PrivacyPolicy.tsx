import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Eye className="h-6 w-6 mr-2 text-primary" />
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-medium mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Email address when you create an account</li>
              <li>Name and profile information you provide</li>
              <li>Content you create, upload, or share on our platform</li>
              <li>Communication preferences and settings</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Usage Information</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Pages visited and features used</li>
              <li>Time spent on the platform</li>
              <li>Search queries and content interactions</li>
              <li>Device information and browser type</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2 text-primary" />
              How We Use Your Information
            </h2>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our services</li>
              <li>Personalize your content experience</li>
              <li>Send important updates and notifications</li>
              <li>Analyze usage patterns to enhance functionality</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Respond to support requests and inquiries</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Lock className="h-6 w-6 mr-2 text-primary" />
              Information Sharing
            </h2>
            
            <p className="mb-4">We do not sell your personal information. We may share information in these limited circumstances:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who help operate our platform</li>
              <li>In case of business transfers or mergers</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            
            <p className="mb-4">You have the right to:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your content</li>
              <li>Opt out of marketing communications</li>
              <li>Object to data processing</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            
            <p className="mb-4">We use cookies and similar technologies to:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Provide personalized content recommendations</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>
            
            <p className="mt-4">You can control cookie settings through your browser preferences.</p>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            
            <ul className="space-y-2">
              <li>Email: privacy@contenthub.example.com</li>
              <li>Address: 123 Content Street, Creator City, CC 12345</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;