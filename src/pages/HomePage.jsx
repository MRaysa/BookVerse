import React from "react";
import Banner from "../components/Home/Banner";
import Testimonials from "../components/Home/Testimonials";
import CategoryGrid from "../components/Home/CategoryGrid";
import ReadingChallenge from "../components/Home/ReadingChallenge";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <CategoryGrid />
      <ReadingChallenge></ReadingChallenge>
      <Testimonials></Testimonials>
    </div>
  );
};

export default HomePage;
