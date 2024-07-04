import Feature from "./_components/feature";
import FrequentlyAskedQuestions from "./_components/frequently-asked-questions";
import HeroBanner from "./_components/hero-banner";

export default async function HomePage() {
  return (
    <>
      <HeroBanner />

      <Feature />

      <FrequentlyAskedQuestions />
    </>
  );
}
