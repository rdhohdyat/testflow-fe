import { Navbar } from "../components/navbar";
import FAQ from "../components/fragment/FAQ";
import About from "../components/fragment/About";
import Service from "../components/fragment/Service";
import Contact from "../components/fragment/Contact";
import Home from "../components/fragment/Home";
import Docs from "../components/fragment/Docs";
import Footer from "../components/fragment/Footer";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function LandingPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      <motion.div variants={itemVariants}>
        <Navbar />
      </motion.div>
      
      <motion.div variants={containerVariants} className="flex flex-col">
        <Home />
        <About />
        <Service />
        <Docs />
        <FAQ />
        <Contact />
        <Footer />
      </motion.div>
    </motion.div>
  );
}

export default LandingPage;
