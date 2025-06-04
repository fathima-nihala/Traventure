import { Star } from 'lucide-react';
import test1 from '../../../assets/testimonial/test1.jpeg';
import test2 from '../../../assets/testimonial/test2.jpeg';
import test3 from '../../../assets/testimonial/test3.jpeg';

interface Testimonial {
  name: string;
  location: string;
  message: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Ayesha Rahman',
    location: 'Kerala, India',
    message:
      'Traventure made my honeymoon trip to Bali absolutely magical. Everything was well planned and stress-free!',
    rating: 5,
    image: test2,
  },
  {
    name: 'David Thompson',
    location: 'London, UK',
    message:
      'Their team helped me explore North India like never before. Highly recommended for adventure lovers!',
    rating: 4,
    image: test3,
  },
  {
    name: 'Priya Menon',
    location: 'Chennai, India',
    message:
      'Booked a group trip to Kashmir – the views, the food, and the local experiences were unforgettable!',
    rating: 5,
    image: test1,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-8 h-full md:h-screen flex flex-col justify-center items-center">
      <div className="max-w-6xl mx-auto text-center flex flex-col justify-center items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Travelers Say</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Hear from real travelers who trusted Traventure for their dream vacations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow-md p-6 text-left hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image || '/default-avatar.jpg'}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 italic">"{testimonial.message}"</p>
              <div className="flex">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
