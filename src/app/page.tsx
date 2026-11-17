import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Experience from "@/components/sections/Experience";
import Honors from "@/components/sections/Honors";
import About from "@/components/sections/About";
import Socials from "@/components/sections/Socials";

export default function Home() {
  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <Certificates />
      <Experience />
      <Honors />
      <About />
      <Socials />
    </>
  );
}