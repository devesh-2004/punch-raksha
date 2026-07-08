import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ButtonBase } from "@/components/ui/ButtonBase";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return {
    title: "Contact Us | PunchRaksha",
    description: "Contact PunchRaksha support and book a free consultation.",
    alternates: { canonical: "/contact" },
  };
}

export default function ContactPage() {
  return (
    <div className="w-full bg-white font-outfit max-md:pb-[45px] md:pb-20">
      <div className="w-full bg-[#EEF7F0] max-md:pt-[30px] md:pt-[45px] 2xl:pt-[60px] max-md:pb-[135px] md:pb-[160px] px-4"> 
        <h1 className="text-center txt-h1 font-semibold text-[#121212]  mb-[15px] md:mb-[20px]">Contact us</h1>
        <div className="max-w-[310px] md:max-w-[760px] 2xl:max-w-[850px] mx-auto text-center space-y-5">
          <p className="txt-p-lg">
            We make expert Ayurvedic advice and natural healthcare simple and accessible for everyone suffering from <span className="underline decoration-1 underline-offset-4">piles</span>, <span className="underline decoration-1 underline-offset-4">constipation</span>, fissure, body pain, and digestive problems.
          </p>
          <p className="txt-p-lg">
            Reach out to our experts and get the right guidance for your health concerns.
          </p>
        </div>
      </div>

      <div className="max-w-[1205px] mx-auto px-4 -mt-[100px] relative z-10">
        <div className="bg-white  shadow-[0px_-2px_25px_0px_rgba(0,0,0,0.25)] p-[30px]  md:p-[40px] lg:p-[60px] max-md:mb-[30px] md:mb-16 flex flex-col md:flex-row gap-0">
          
          {/* Left Column */}
          <div className="flex-1 md:pr-12">
            <h2 className="txt-h2 font-semibold text-[#111] mb-[20px] md:p-8">Talk to Our Representative</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="mt-1 flex-shrink-0 text-primary">
                  <Image src="/images/contactus/phone.svg" width={22} height={22} alt="Phone" className="w-[22px] h-[22px]" unoptimized />
                </div>
                <div>
                  <p className="font-medium text-[#111] txt-p-lg mb-[5px]">+91-7405498441</p>
                  <p className="text-[#555] txt-p">Monday to Saturday | 10:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 flex-shrink-0 text-primary">
                  <Image src="/images/contactus/Mail.svg" width={22} height={22} alt="Mail" className="w-[22px] h-[22px]" unoptimized />
                </div>
                <div>
                  <p className="font-medium txt-p-lg mb-[5px]">nithastu.care@gmail.com</p>
                  <p className="text-[#555] txt-p">Our team will respond to your email within 24 hours during working days.</p>
                </div>
              </div>

              <div className="flex gap-[10px] items-start">
                <div className="mt-1 flex-shrink-0 text-primary">
                  <Image src="/images/contactus/location.svg" width={22} height={22} alt="Location" className="w-[22px] h-[22px]" unoptimized />
                </div>
                <div>
                  <p className="font-medium txt-p-lg mb-[5px]">Address</p>
                  <p className="text-[#555] txt-p pr-4">E-67, Parishraram Nagar Division-1, Krishnanagar, Ahmedabad-382346</p>
                </div>
              </div>
            </div>

            <hr className="border-[#111] mt-[30px] mb-[30px] md:hidden" />
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:flex items-center justify-center px-0">
            <div className="w-px bg-[#111] h-[80%]"></div>
          </div>

          {/* Right Column */}
          <div className="flex-1 md:pl-[90px] md:pt-0">
            <h2 className="txt-h2 font-semibold text-[#111] mb-[15px]  md:mb-6">Order Tracking</h2>
            
            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="enter order AWB number here" 
                className="w-full bg-[#E8E8E8] h-[50px] px-5 rounded-[4px] outline-none txt-p placeholder:text-gray-500 border border-transparent focus:border-gray-500 transition-colors"
              />
              <ButtonBase className="!flex-none !w-[148px] max-md:text-[12px] !text-[16px] !h-[50px] !py-0 !bg-[#121212] !rounded-[10px] border border-[#121212] hover:!bg-black tracking-wide">
                TRACK NOW
              </ButtonBase>
            </div>

            <hr className="border-[#111] my-[30px] md:my-[45px]" />

            <h2 className="txt-h2 font-semibold text-[#111] mb-[15px] md:mb-5">Stay Connected Online</h2>
            <div className="flex items-center gap-4">
              <Link href="https://www.facebook.com/punchraksha/" target="_blank" aria-label="Facebook" className="icon-glare transition-transform duration-300 hover:-translate-y-1">
                <Image src="/images/homepage/facebook.svg" alt="Facebook" width={50} height={50} className="w-[45px] h-[45px] md:w-[50px] md:h-[50px]" />
              </Link>
              <Link href="https://www.instagram.com/punchraksha/" target="_blank" aria-label="Instagram" className="icon-glare transition-transform duration-300 hover:-translate-y-1">
                <Image src="/images/homepage/instagram.svg" alt="Instagram" width={50} height={50} className="w-[45px] h-[45px] md:w-[50px] md:h-[50px]" />
              </Link>
              <Link href="https://wa.me/917405498441" target="_blank" aria-label="WhatsApp" className="icon-glare transition-transform duration-300 hover:-translate-y-1">
                <Image src="/images/homepage/whatsapp.svg" alt="Whatsapp" width={50} height={50} className="w-[45px] h-[45px] md:w-[50px] md:h-[50px]" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <ButtonBase href="/all-products" className="!flex-none !px-10 lg:!w-[400px] !rounded-[15px]">
            BROWSE OUR PRODUCTS
          </ButtonBase>
        </div>
      </div>
    </div>
  );
}

