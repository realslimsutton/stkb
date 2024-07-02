import { getUser } from "~/shop-titans/utils";
import Footer from "./_components/footer";
import Header from "./_components/header";
import HeroBanner from "./_components/hero-banner";
import Feature from "./_components/feature";
import FrequentlyAskedQuestions from "./_components/frequently-asked-questions";

export default async function HomePage() {
  const user = await getUser();

  return (
    <>
      <Header user={user} />

      <HeroBanner />

      <Feature />

      <FrequentlyAskedQuestions />

      <Footer />
    </>
  );
}
