
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Introduction</h2>
          <p>
            Welcome to Mamatoto. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect via the Application includes:
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application.</li>
            <li><strong>Health Data:</strong> Information related to your health, such as pregnancy status, due dates, symptoms, weight, and other health metrics you choose to provide.</li>
          </ul>

          <h2>Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
          </p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Personalize your experience.</li>
            <li>Provide you with health insights and recommendations.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: privacy@mamatoto.app
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
