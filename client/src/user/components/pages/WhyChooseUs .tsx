import { Globe, Clock, ThumbsUp, Users } from 'lucide-react';
import { ReactNode } from 'react';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Globe className="h-8 w-8 text-green-600" />,
    title: 'Worldwide Destinations',
    description: 'Explore curated trips to breathtaking places across the globe.',
  },
  {
    icon: <Clock className="h-8 w-8 text-green-600" />,
    title: '24/7 Support',
    description: 'We’re always here to help you during your journey.',
  },
  {
    icon: <ThumbsUp className="h-8 w-8 text-green-600" />,
    title: 'Trusted by Thousands',
    description: 'Thousands of happy travelers trust us every year.',
  },
  {
    icon: <Users className="h-8 w-8 text-green-600" />,
    title: 'Personalized Trips',
    description: 'Tailor-made travel experiences that suit your style.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-gray-50 py-12 px-4 md:px-10 h-full md:h-screen flex flex-col justify-center items-center ">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Traventure?</h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Discover why so many travelers choose us to plan their adventures.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
