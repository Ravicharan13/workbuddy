import React from 'react'
import Banner from './Banner'
import Feature from './Feature'
import NewsletterSignup from './NewsletterSignup'
import Works from './Works'
import Stats from './Stats'
import SecurityAssurance from './SecurityAssurance'
import ServiceCategories from './ServiceCategories'
import PromoStrip from './PromoStrip'
import TestimonialsSlider from './TestimonialsSlider'
import FAQ from './FAQ'
import Footer from '../../WorkerHomePage/Footer'
function Home() {
  return (
    <>
    <Banner/>
    <Feature/>
    <NewsletterSignup/>
    <SecurityAssurance/>
    <PromoStrip/>
    <Stats/>
    <ServiceCategories/>
    <Works/>
    <FAQ/>
    <TestimonialsSlider/>
    <Footer/>
    </>
  )
}

export default Home