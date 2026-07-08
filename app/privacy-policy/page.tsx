import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return {
    title: "Privacy Policy | PunchRaksha",
    description: "Privacy policy for PunchRaksha website.",
    alternates: { canonical: "/privacy-policy" },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1920px] px-4 lg:px-[50px] py-[40px] md:py-[45px]">
        <h1 className="font-outfit txt-h1 font-bold text-[#121212] mb-[20px]">
          Privacy Policy
        </h1>
        <p className="font-outfit txt-p text-[#121212] mb-[20px]">
          Effective Date: 15-04-2026
        </p>

        <div className="max-w-[1200px] space-y-10 font-outfit text-[#121212]">
          <div className="space-y-[20px]">
            <p className="txt-p">
              Welcome to PunchRaksha. Your privacy and personal information are important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, contact us for wellness or nutrition guidance, or purchase our wellness products.

            </p>
            <p className="txt-p">
              By using our website or services, you agree to the terms outlined
              in this Privacy Policy.
            </p>
          </div>

          <div className="space-y-[20px]">
            <h2 className="txt-h2 font-bold mb-[20px]">
              1. Information We Collect
            </h2>
            <p className="txt-p">
              When you interact with our website or contact our support team, we
              may collect the following information.
            </p>

            <h3 className="txt-h3-sm font-bold mt-5 mb-2">
              Personal Information
            </h3>
            <p className="txt-p mb-2">
              We may collect personal details such as:
            </p>
            <ul className="list-disc pl-[20px] space-y-2.5 txt-p mb-4 ml-[6px]">
              <li>Full Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Shipping and billing address</li>
              <li>Order details</li>
            </ul>

            <h3 className="txt-h3-sm font-bold mt-5 mb-2">
              Health-Related Information
            </h3>
            <p className="txt-p mb-2">
              If you contact us for consultation or guidance related to wellness
              concerns such as piles, constipation, or digestive health, you may
              voluntarily provide information related to your condition.
            </p>
            <p className="txt-p mb-2">This may include:</p>
            <ul className="list-disc pl-[20px] space-y-2.5 txt-p mb-4 ml-[6px]">
              <li>Symptoms</li>
              <li>Health concerns</li>
              <li>Medical history shared by you</li>
              <li>Lifestyle information relevant to consultation</li>
            </ul>
            <p className="txt-p">
              This information is used only to understand your wellness concerns and to provide general wellness, nutrition, and product-related guidance.

            </p>

            <h3 className="txt-h3-sm font-bold mt-5 mb-2">
              Technical Information
            </h3>
            <p className="txt-p mb-2">
              We may also automatically collect certain technical information
              when you visit our website, such as:
            </p>
            <ul className="list-disc pl-[20px] space-y-2.5 txt-p mb-4 ml-[6px]">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Pages visited</li>
              <li>Website usage data</li>
            </ul>
            <p className="txt-p">
              This information helps us improve our website and services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">
              2. How Your Information is Used
            </h2>
            <p className="txt-p mb-2">
              Your information may be used for the following purposes:
            </p>
            <ul className="list-disc pl-[20px] space-y-2.5 txt-p mb-4 ml-[6px]">
              <li>To process and deliver your orders</li>
              <li>To respond to your queries and consultation requests</li>
              <li>
                To review the information you voluntarily provide in order to offer general wellness, nutrition, and product-related guidance.

              </li>
              <li>
                To provide guidance regarding suitable Ayurvedic wellness
                products
              </li>
              <li>To improve our services and customer experience</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>
            <p className="txt-p">
              We do not sell or trade your personal information to third
              parties.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">
              3. Wellness and Nutrition Guidance
            </h2>
            <p className="txt-p">
              Customers may voluntarily contact PunchRaksha to receive general wellness, nutrition, lifestyle, or product-related guidance.


            </p>
            <p className="txt-p">
              Any information shared by customers, including symptoms, health concerns, lifestyle information, or other details, is used only to understand their concerns and provide general wellness and nutrition guidance.

            </p>
            <p className="txt-p">
              Any suggestions or recommendations provided by PunchRaksha are intended solely for informational and wellness support purposes and should not be considered medical advice, diagnosis, or treatment.

            </p>
            <p className="txt-p">
              Whether or not the founder or any representative identifies themselves as a nutritionist during any communication does not alter the nature of the guidance provided, which remains informational and intended solely for general wellness support.


            </p>
            <p className="txt-p">
              Customers are solely responsible for deciding whether to follow or disregard any guidance, suggestions, or recommendations provided during communication with PunchRaksha.

            </p>
            <p className="txt-p" >
             Customers should always consult a qualified medical doctor or healthcare professional regarding any medical condition, diagnosis, treatment, emergency, or medication.

            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">4. Communication</h2>
            <p className="txt-p mb-2">
              We may communicate with customers through:{" "}
            </p>
            <ul className="list-disc pl-[20px] space-y-2.5 txt-p mb-4 ml-[6px]">
              <li>Phone calls</li>
              <li>Email</li>
              <li>WhatsApp</li>
              <li>Website contact forms</li>
              <li>Other digital communication methods</li>
            </ul>
            <p className="txt-p">
              These communications may be used to provide wellness guidance, nutrition support, order updates, customer assistance, and responses to customer inquiries.


            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">5. Payment Security</h2>
            <p className="txt-p">
              Payments made on our website are processed through secure
              third-party payment gateways. We do not store debit card, credit
              card, or banking details on our servers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">6. Cookies</h2>
            <p className="txt-p">
              Our website may use cookies to improve your browsing experience.
              Cookies help us understand website usage, remember preferences,
              and improve functionality.
            </p>
            <p className="txt-p">
              You may disable cookies through your browser settings if you
              prefer.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">7. Data Sharing</h2>
            <p className="txt-p mb-2">
              Your information may be shared only with limited and trusted
              parties when necessary, including:
            </p>
            <ul className="list-disc pl-[20px] space-y-2.5 txt-p mb-4 ml-[6px]">
              <li>Delivery partners for shipping orders</li>
              <li>Payment gateway providers for payment processing</li>
              <li>Technical service providers who maintain our website</li>
            </ul>
            <p className="txt-p">
              These parties are expected to maintain confidentiality of the
              shared information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">8. Health Disclaimer</h2>
            <p className="txt-p">
              The information and products available on this website, including
              those related to piles relief, constipation support, and digestive
              wellness, are intended for general wellness support.
            </p>
            <p className="txt-p">
             They are not intended to provide medical advice, diagnosis, or treatment and should not be considered a substitute for professional medical care. Customers should always consult a qualified medical doctor or healthcare professional regarding any medical condition, diagnosis, treatment, emergency, or medication.
            </p>
            <p className="txt-p">
             Nothing contained on this website or communicated by PunchRaksha should be interpreted as establishing a doctor-patient relationship or replacing professional medical care.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">9. Data Protection</h2>
            <p className="txt-p">
              We implement reasonable security practices to protect your
              personal information from unauthorized access, misuse, or
              disclosure.
            </p>
            <p className="txt-p">
              However, no method of data transmission over the internet is
              completely secure.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="txt-h2 font-bold mb-3">
              10. Updates to This Policy
            </h2>
            <p className="txt-p">
              The content of this Privacy Policy, along with our{" "}
              <Link href="/terms" className="underline hover:no-underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/refund-policy" className="underline hover:no-underline">
                Refund Policy
              </Link>
              , may be updated or modified from time to time to reflect
              operational, legal, or regulatory changes.
            </p>
            <p className="txt-p">
              Any updates will be posted on the respective pages of our website
              with the revised effective date.{" "}
            </p>
            <p className="txt-p">
              It is the responsibility of users and customers to review the
              Privacy Policy, Terms of Service, and Refund Policy periodically
              to stay informed about any changes.
            </p>

            <p className="txt-p">
              We may not provide individual notifications regarding updates to
              these policies.
            </p>
          </div>

          <div className="space-y-[15px]">
            <h2 className="txt-h2 font-bold mb-3">11. Contact Information</h2>
            <p className="txt-p ">
              If you have any questions regarding this Privacy Policy, you may
              contact us:
            </p>
            <div className="txt-p space-y-[10px]">
              <p>
                Email: &nbsp;
                <a
                  href="mailto:Nithastu.care@gmail.com"
                  className="hover:underline"
                >
                  Nithastu.care@gmail.com
                </a>
              </p>
              <p>Phone: +91 7405498441</p>
              <p>
                Address : E-67 - Parishraram Nagar Division-1 , Krishnanagar,
                Ahmedabad-382345
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
