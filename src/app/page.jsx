import HeroSlider from "../app/welcome/components/HeroSlider";
import Footer from "../app/welcome/components/Footer";
import Navigation from "../app/welcome/components/Navigation";
import Features from "../app/welcome/components/Features";
import ValueProposition from "../app/welcome/components/ValueProposition";
export default function Home() {
  return (
    <div className="min-h-screen ">
      <Navigation />


      <HeroSlider />
      <ValueProposition />
      <Features />
      {/* CTA Section */}
      <section className="bg-base-200 text-[#F6F6F6] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform FYP Management?
          </h2>
          <p className="text-xl mb-8">
            Join universities worldwide using VISION for effective project
            supervision
          </p>
          <div className="space-x-4">
            <button className="border-2 border-black bg-[#656e776d] text-[#DDDBDE] px-8 py-3 rounded-lg hover:xl:bg-transparent  hover:text-[#F6F6F6] transition-colors">
              Schedule Demo
            </button>
            <button className="border-2 border-black px-8 py-3 rounded-lg hover:text-white hover:bg-[#656e776b] transition-colors">
              Documentation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
