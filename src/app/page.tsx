import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold">Welcome to MyApp!</h1>
        <p className="mt-4">This is the home page of the application.</p>
      </main>
      <Footer />
    </div>
  );
}
