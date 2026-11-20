import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Journey from "@/components/sections/Journey";
import Resume from "@/components/sections/Resume";
import TechStack from "@/components/sections/TechStack";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Journey />
      <Resume />
      <TechStack />
      <Contact />
    </>
  );
}
