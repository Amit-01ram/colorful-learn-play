import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, AlertTriangle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
            <FileText className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            
            <p className="mb-4">
              By accessing and using ContentHub, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            
            <p className="mb-4">
              Permission is granted to temporarily access ContentHub for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Content</h2>
            
            <h3 className="text-xl font-medium mb-3">Content Ownership</h3>
            <p className="mb-4">
              You retain ownership of any intellectual property rights that you hold in content you submit to ContentHub. 
              By submitting content, you grant us a worldwide, royalty-free license to use, display, and distribute your content.
            </p>

            <h3 className="text-xl font-medium mb-3">Content Standards</h3>
            <p className="mb-4">All content must comply with our community guidelines:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be respectful and constructive</li>
              <li>No harassment, hate speech, or discrimination</li>
              <li>No spam or misleading information</li>
              <li>Respect intellectual property rights</li>
              <li>No illegal or harmful content</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8 border-warning/20 bg-warning/5">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-warning" />
              Disclaimers
            </h2>
            
            <p className="mb-4">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
              this Company:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Excludes all representations and warranties relating to this website and its contents</li>
              <li>Does not warrant that the website will be constantly available or available at all</li>
              <li>Makes no representations about the accuracy or completeness of user-generated content</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            
            <p className="mb-4">
              In no event shall ContentHub or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on ContentHub's website.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Account Termination</h2>
            
            <p className="mb-4">We reserve the right to terminate accounts that:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate our terms of service or community guidelines</li>
              <li>Engage in abusive or harmful behavior</li>
              <li>Attempt to circumvent platform security</li>
              <li>Are inactive for extended periods</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of 
              [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts 
              in that state or location.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-card">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              Contact Information
            </h2>
            
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <ul className="space-y-2">
              <li>Email: legal@contenthub.example.com</li>
              <li>Address: 123 Content Street, Creator City, CC 12345</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;