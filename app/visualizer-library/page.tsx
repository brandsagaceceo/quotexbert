"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ArrowLeft, ArrowRight } from 'lucide-react';

interface VisualizerExample {
  id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  style: string;
}

const DEMO_EXAMPLES: VisualizerExample[] = [
  {
    id: '1',
    title: 'Kitchen Inspiration',
    category: 'Kitchen',
    beforeImage: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=600&h=400&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=600&h=400&fit=crop',
    description: 'Illustrative stock-photo inspiration for a kitchen refresh',
    style: 'Contemporary',
  },
  {
    id: '2',
    title: 'Bathroom Inspiration',
    category: 'Bathroom',
    beforeImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    description: 'Illustrative stock-photo inspiration for a bathroom refresh',
    style: 'Modern Luxury',
  },
  {
    id: '3',
    title: 'Basement Inspiration',
    category: 'Basement',
    beforeImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&h=400&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
    description: 'Illustrative stock-photo inspiration for a basement',
    style: 'Cozy Modern',
  },
  {
    id: '4',
    title: 'Living Room Inspiration',
    category: 'Living Room',
    beforeImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop',
    description: 'Illustrative stock-photo inspiration for a living room',
    style: 'Open Concept',
  },
  {
    id: '5',
    title: 'Flooring Inspiration',
    category: 'Flooring',
    beforeImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=400&fit=crop',
    description: 'Illustrative stock-photo flooring inspiration',
    style: 'Classic',
  },
  {
    id: '6',
    title: 'Exterior Inspiration',
    category: 'Exterior',
    beforeImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    description: 'Illustrative stock-photo inspiration for an exterior refresh',
    style: 'Contemporary',
  },
  {
    id: '7',
    title: 'Bedroom Inspiration',
    category: 'Bedroom',
    beforeImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop',
    description: 'Illustrative stock-photo inspiration for a bedroom',
    style: 'Modern Elegance',
  },
  {
    id: '8',
    title: 'Outdoor Living Inspiration',
    category: 'Outdoor',
    beforeImage: 'https://images.unsplash.com/photo-1600375572810-d4ac3637e201?w=600&h=400&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
    description: 'Illustrative stock-photo inspiration for outdoor living',
    style: 'Modern Outdoor',
  }
];

export default function VisualizerLibrary() {
  const [examples, setExamples] = useState<VisualizerExample[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExample, setSelectedExample] = useState<VisualizerExample | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBefore, setShowBefore] = useState(true);

  useEffect(() => {
    // Load examples (in production, fetch from API)
    setExamples(DEMO_EXAMPLES);
  }, []);

  const categories = ['all', ...Array.from(new Set(examples.map(e => e.category)))];

  const filteredExamples = selectedCategory === 'all'
    ? examples
    : examples.filter(e => e.category === selectedCategory);

  const openModal = (example: VisualizerExample) => {
    setSelectedExample(example);
    setIsModalOpen(true);
    setShowBefore(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExample(null);
  };

  const navigateExample = (direction: 'prev' | 'next') => {
    if (!selectedExample) return;
    
    const currentIndex = filteredExamples.findIndex(e => e.id === selectedExample.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? filteredExamples.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === filteredExamples.length - 1 ? 0 : currentIndex + 1;
    }
    
    const nextExample = filteredExamples[newIndex];
    if (nextExample) {
      setSelectedExample(nextExample);
      setShowBefore(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#800020] mb-4">
            Renovation Inspiration Gallery
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore renovation styles with illustrative stock photography.
          </p>
          <p className="mt-4 mx-auto max-w-3xl rounded-xl border border-rose-200 bg-white p-4 text-left text-sm text-slate-700">
            Illustrative stock-image examples. These independent photos are not actual QuoteXbert customer projects,
            before-and-after results, or AI-generated visualizations. No project costs are provided.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-[#800020] text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExamples.map(example => (
            <div
              key={example.id}
              onClick={() => openModal(example)}
              className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative h-56">
                <Image
                  src={example.afterImage}
                  alt={example.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4 text-[#800020]" />
                  <span className="text-sm font-semibold text-slate-900">View Details</span>
                </div>
                <div className="absolute top-3 left-3 bg-[#800020] text-white px-3 py-1 rounded-full text-xs font-bold">
                  {example.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{example.title}</h3>
                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{example.description}</p>
                <div className="text-sm text-slate-500">{example.style}</div>
              </div>
            </div>
          ))}
        </div>

        {filteredExamples.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-600">No examples found in this category</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedExample && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedExample.title}</h2>
                <p className="text-slate-600">{selectedExample.description}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Illustrative stock-photo toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setShowBefore(true)}
                    className={`px-6 py-2 rounded-md font-semibold transition-all ${
                      showBefore
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Photo 1
                  </button>
                  <button
                    onClick={() => setShowBefore(false)}
                    className={`px-6 py-2 rounded-md font-semibold transition-all ${
                      !showBefore
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Photo 2
                  </button>
                </div>
              </div>

              {/* Image Display */}
              <div className="relative h-96 md:h-[500px] bg-slate-100 rounded-xl overflow-hidden mb-6">
                <Image
                  src={showBefore ? selectedExample.beforeImage : selectedExample.afterImage}
                  alt={`${showBefore ? 'First' : 'Second'} illustrative stock photo for ${selectedExample.category}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm font-semibold text-slate-600 mb-1">Category</div>
                  <div className="text-lg font-bold text-slate-900">{selectedExample.category}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm font-semibold text-slate-600 mb-1">Style</div>
                  <div className="text-lg font-bold text-slate-900">{selectedExample.style}</div>
                </div>
              </div>

              {/* Navigation & Action Buttons */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); navigateExample('prev'); }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <a
                  href="/visualizer"
                  className="flex-1 max-w-md bg-[#800020] text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Try AI Visualizer
                </a>
                
                <button
                  onClick={(e) => { e.stopPropagation(); navigateExample('next'); }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
