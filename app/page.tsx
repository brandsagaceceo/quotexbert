import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Toronto, ON",
      text: "Got quotes from 3 contractors in under 5 minutes. Saved over $2,000 on my kitchen renovation!",
      rating: 5
    },
    {
      name: "Mike R.",
      location: "Vancouver, BC",
      text: "Amazing service! Found a reliable roofer through quotexbert. The whole process was seamless.",
      rating: 5
    },
    {
      name: "Jennifer L.",
      location: "Montreal, QC", 
      text: "As a contractor, I love the quality leads I get through quotexbert. Highly recommend!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-ink-100">
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Image
              src="/logo.svg"
              alt="quotexbert logo"
              width={80}
              height={80}
              className="w-20 h-20 mx-auto mb-6"
            />
            <h1 className="text-4xl sm:text-6xl font-bold text-ink-900 mb-6">
              Get Instant Quotes from
              <span className="text-brand block">Trusted Contractors</span>
            </h1>
            <p className="text-xl text-ink-600 leading-relaxed max-w-3xl mx-auto mb-8">
              Connect with verified contractors in your area. Compare quotes, read reviews, 
              and get your home improvement project started today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/jobs"
              className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              Get Free Quote
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/contractors"
              className="border-2 border-brand text-brand hover:bg-brand hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200"
            >
              Join as Contractor
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-brand mb-2">10,000+</div>
              <div className="text-ink-600">Projects Completed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-brand mb-2">500+</div>
              <div className="text-ink-600">Verified Contractors</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-brand mb-2">4.9/5</div>
              <div className="text-ink-600">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-ink-600 max-w-2xl mx-auto">
              Get connected with trusted contractors in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-4">1. Describe Your Project</h3>
              <p className="text-ink-600">
                Tell us about your home improvement project in just a few minutes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-4">2. Get Matched</h3>
              <p className="text-ink-600">
                We connect you with verified contractors in your area who specialize in your project type
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ink-900 mb-4">3. Compare & Choose</h3>
              <p className="text-ink-600">
                Review quotes, check ratings, and choose the perfect contractor for your project
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-ink-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-ink-600 max-w-2xl mx-auto">
              Join thousands of satisfied homeowners who found their perfect contractor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-ink-700 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="text-sm">
                  <div className="font-bold text-ink-900">{testimonial.name}</div>
                  <div className="text-ink-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get connected with trusted contractors in your area today
          </p>
          <Link
            href="/jobs"
            className="bg-white text-brand hover:bg-ink-50 px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 inline-flex items-center"
          >
            Get Your Free Quote
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
