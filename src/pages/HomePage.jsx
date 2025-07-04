import React from "react";
import Banner from "../components/Home/Banner";
import Testimonials from "../components/Home/Testimonials";
import CategoryGrid from "../components/Home/CategoryGrid";
import ReadingChallenge from "../components/Home/ReadingChallenge";
import EventsSection from "../components/Home/EventsSection";
import LibraryStats from "../components/Home/LibraryStats";
import NewReleases from "../components/Home/NewReleases";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <CategoryGrid />
      <ReadingChallenge></ReadingChallenge>
      <NewReleases></NewReleases>
      <EventsSection></EventsSection>
      <Testimonials></Testimonials>
      <LibraryStats></LibraryStats>
    </div>
  );
};

export default HomePage;
