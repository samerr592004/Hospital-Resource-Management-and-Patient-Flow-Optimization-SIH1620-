import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TestimonialCarousel = ({ testimonials }) => {
   
  //  console.log(testimonials)
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 tracking-wider">
          CUSTOMER TESTIMONIALS
        </h2>

        {testimonials.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={40}
              slidesPerView={1}
              navigation={{
                nextEl: ".testimonial-swiper-button-next",
                prevEl: ".testimonial-swiper-button-prev",
              }}
              loop={true}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-8">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover mr-6 border-2 border-gray-200"
                      />


                      <div className="text-left">
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < testimonial.stars ? "text-yellow-400" : "text-gray-600"}
                            />
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-wider">
                          {testimonial.name}
                        </h3>
                      </div>
                      
                    </div>

                    <div className="border-t border-gray-300 w-20 mx-auto my-6"></div>

                    <p className="text-gray-700 mb-8 leading-relaxed  tracking-wider font-semibold text-lg">
                     " {testimonial.feedback}"
                    </p>

                   
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="testimonial-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10">
              <FaChevronLeft className="text-gray-500 text-2xl hover:text-gray-700 transition" />
            </button>
            <button className="testimonial-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10">
              <FaChevronRight className="text-gray-500 text-2xl hover:text-gray-700 transition" />
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No testimonials available.</p>
        )}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
