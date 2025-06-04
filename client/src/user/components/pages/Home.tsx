import Banner from "./Banner"
import GetToKnowUs from "./GetToKnowUs"
import Testimonials from "./Testimonials"
import WhyChooseUs from "./WhyChooseUs "

const Home = () => {
  return (
    <div className='mt-16'>
     <Banner/>
     <WhyChooseUs/>
     <GetToKnowUs/>
     <Testimonials/>
    </div>
  )
}

export default Home
