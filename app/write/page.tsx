import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import WriteForm from "@/components/WriteForm";

export default function WritePage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />

      <main className="main-content">
        <div className="write-page">
          <WriteForm />
        </div>
      </main>
    </>
  );
}
