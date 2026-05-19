import React from 'react';
import { Hero, EmergencyBanner } from '../components/Hero';
import { QuickPaths, ZenZoneTeaser, Destigmatization, Compass, YouthSection, GuideSection, SocialProof } from '../components/MainSections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <EmergencyBanner />
      <QuickPaths />
      <ZenZoneTeaser />
      <SocialProof />
      <Destigmatization />
      <Compass />
      <YouthSection />
      <GuideSection />
    </>
  );
}
