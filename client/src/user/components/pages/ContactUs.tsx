import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs: React.FC = () => {
  return (
    <div className="mt-20 px-4 md:px-20 py-10 bg-white">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Contact <span className="text-green-600">Traventure</span>
      </h2>
      <p className="text-center text-gray-600 mb-12">
        We'd love to hear from you. Whether you're planning a trip or just have a question, feel free to reach out!
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form action="https://usebasin.com/f/01b2ed27c151"  // replace with your Basin endpoint
          method="POST" className="bg-gray-50 shadow-lg rounded-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              placeholder="Your message..."
              rows={5}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 cursor-pointer rounded-md hover:bg-green-700 transition-all duration-300">
            <Send size={18} /> Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="flex flex-col gap-6 justify-center">
          <div className="flex items-start gap-4">
            <MapPin className="text-green-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Our Office</h4>
              <p className="text-gray-600">123 Traventure Lane, Wander City, Country 456789</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="text-green-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Phone</h4>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="text-green-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Email</h4>
              <p className="text-gray-600">contact@traventure.com</p>
            </div>
          </div>

          {/* Google Map */}
          <div className="mt-6">
            <iframe
              className="w-full h-64 rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.084539738378!2d144.95373541568316!3d-37.8162798420496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1e27f1f%3A0x6f7b4bceebb0e8d1!2sVictoria!5e0!3m2!1sen!2sau!4v1625542042934!5m2!1sen!2sau"
              allowFullScreen
              loading="lazy"
              title="Traventure Office Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
