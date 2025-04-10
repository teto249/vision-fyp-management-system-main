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
      <section className="bg-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-400">
            Ready to Transform FYP Management?
          </h2>
          <div className="space-x-4">
            <button className="bg-green-500 text-gray-900 px-8 py-3 rounded-lg hover:bg-green-400 transition-colors">
              Schedule Demo
            </button>
            <button className="border-2 border-green-400 text-green-400 px-8 py-3 rounded-lg hover:bg-green-400 hover:text-gray-900 transition-colors">
              Documentation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
