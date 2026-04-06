import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TalksSection from "@/components/TalksSection";

const Talks = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <TalksSection />
      </div>
      <Footer />
    </div>
  );
};

export default Talks;
