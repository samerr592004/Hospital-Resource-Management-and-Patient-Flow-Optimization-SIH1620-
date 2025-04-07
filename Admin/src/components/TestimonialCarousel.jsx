import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TestimonialCarousel = ({ testimonials }) => {
  return (
    <div className="bg-white py-4 px-4 relative">
      <div className="max-w-2xl mx-auto">
        {testimonials.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
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
                    <div className="flex flex-col items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 mb-2"
                      />
                      <h3 className="text-md font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${i < testimonial.stars ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 w-12 mx-auto my-3"></div>

                    <p className="text-gray-600 text-sm leading-snug px-4">
                      "{testimonial.feedback}"
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="testimonial-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10">
              <FaChevronLeft className="text-gray-400 text-lg hover:text-gray-600 transition" />
            </button>
            <button className="testimonial-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10">
              <FaChevronRight className="text-gray-400 text-lg hover:text-gray-600 transition" />
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm">No testimonials available</p>
        )}
      </div>
    </div>
  );
};

export default TestimonialCarousel;