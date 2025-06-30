import React from 'react'
import Banner from './Banner'
import Works from "./Works"
import Feature from './Feature'
import Testimonial from './Tesimonial'
import NewsletterSignup from './NewsletterSignup'
import BlogResources from './BlogResources'
import TopRatedWorkers from "./TopRatedWorkers"
import LatestJobFeed from './LatestJobFeed'
import LiveStats from "./LiveStats"
import ServiceCategories from "./ServiceCategories"
import FaqSection from "./FaqSection"
import Footer from './Footer'
function Home() {
  return (
    <>
    <Banner/>
    <Feature/>
    <NewsletterSignup/>
    <LiveStats/>
    <Works/>
    <ServiceCategories/>
    <LatestJobFeed/>
    <BlogResources/>
    <TopRatedWorkers/>
    <FaqSection/>
    <Testimonial/>
    <Footer/>
    </>
  )
}

export default Home