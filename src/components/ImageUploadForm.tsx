"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import ReactConfetti from 'react-confetti';
import ReCAPTCHA from 'react-google-recaptcha';

const styles = `
  @keyframes progress {
    0% { width: 0% }
    100% { width: 100% }
  }
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`;

const ImageUploadForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [styleStrength, setStyleStrength] = useState('standard');
  const [watermark, setWatermark] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('1');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentTopTestimonial, setCurrentTopTestimonial] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const isLocalhost = process.env.NODE_ENV === 'development';

  const topTestimonials = [
    {
      initial: 'L',
      name: 'Linda Krasniqi',
      role: 'Influencere',
      color: 'from-pink-400 to-rose-600',
      text: 'Rezultatet ishin mahnitëse! Fotoja ime e profilit duket sikur është direkt nga një anime!'
    },
    {
      initial: 'B',
      name: 'Besart Morina',
      role: 'Fotograf Digital',
      color: 'from-purple-400 to-indigo-600',
      text: 'Transformimi i fotove të mia profesionale në stil Ghibli ka sjellë një dimension të ri në punën time!'
    },
    {
      initial: 'D',
      name: 'Drita Berisha',
      role: 'Artiste Digjitale',
      color: 'from-blue-400 to-cyan-600',
      text: 'Cilësia e transformimit është e jashtëzakonshme. Çdo detaj është përpunuar me kujdes të veçantë.'
    },
    {
      initial: 'V',
      name: 'Vjosa Hoxha',
      role: 'Stiliste',
      color: 'from-teal-400 to-emerald-600',
      text: 'Shërbimi më i mirë që kam përdorur ndonjëherë për transformimin e fotove. Rezultatet janë magjike!'
    }
  ];

  const testimonials = [
    {
      initial: 'M',
      name: 'Mira Krasniqi',
      role: 'Artiste',
      color: 'from-blue-400 to-blue-600',
      text: 'Transformimi i fotove të mia në stilin Studio Ghibli është thjesht magjik! Rezultatet janë mahnitëse dhe shërbimi është i shpejtë.'
    },
    {
      initial: 'A',
      name: 'Andi Berisha',
      role: 'Fotograf',
      color: 'from-purple-400 to-purple-600',
      text: 'Si fotograf profesionist, jam shumë i kënaqur me cilësinë e transformimeve. Detajet dhe ngjyrat janë të jashtëzakonshme!'
    },
    {
      initial: 'E',
      name: 'Elena Hoxha',
      role: 'Dizajnere',
      color: 'from-green-400 to-green-600',
      text: 'Kam përdorur shumë shërbime të ngjashme, por ky është padyshim më i miri. Transformimet janë unike dhe procesi është shumë i thjeshtë.'
    },
    {
      initial: 'R',
      name: 'Rinor Maloku',
      role: 'Artist Digital',
      color: 'from-orange-400 to-red-600',
      text: 'Projektet e mia kanë marrë një dimension krejtësisht të ri me këtë shërbim. Klientët janë të mahnitur!'
    },
    {
      initial: 'F',
      name: 'Fjolla Osmani',
      role: 'Influencere',
      color: 'from-pink-400 to-rose-600',
      text: 'Përdorimi i këtij shërbimi ka revolucionarizuar përmbajtjen time në mediat sociale. Ndjekësit e mi janë të fascinuar!'
    },
    {
      initial: 'G',
      name: 'Gent Shala',
      role: 'Animator',
      color: 'from-yellow-400 to-amber-600',
      text: 'Si animator, vlerësoj shumë cilësinë e transformimeve. Detajet dhe ngjyrat janë pikërisht ashtu siç duhen.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTopTestimonial((prev) => (prev + 1) % topTestimonials.length);
    }, 4000); // Change top testimonial every 4 seconds

    return () => clearInterval(timer);
  }, [topTestimonials.length]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Set initial dimensions
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMaxImagesForPackage = (packageType: string) => {
    switch (packageType) {
      case '1': return 1;  // Free package
      case '5': return 5;  // Standard package
      case '10': return 10; // Pro package
      default: return 1;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const maxImages = getMaxImagesForPackage(selectedPackage);
    
    if (selectedFiles.length + files.length > maxImages) {
      toast.error(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Kufizim i paketës!</div>
          <div className="text-sm">Paketa juaj lejon maksimumi {maxImages} foto. Ju lutem përmirësoni paketën për më shumë.</div>
        </div>,
        {
          duration: 4000,
          position: 'top-center',
          icon: '⚠️',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
            minWidth: '300px',
          },
        }
      );
      return;
    }

    const validFiles = selectedFiles.filter(file => {
      if (file.size > 4.5 * 1024 * 1024) {
        toast.error(`File "${file.name}" është shumë i madh. Madhësia maksimale është 4.5MB`, {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
          },
        });
        return false;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error(`File "${file.name}" nuk është në formatin e duhur. Lejohen vetëm PNG, JPG ose JPEG`, {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
          },
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const maxImages = getMaxImagesForPackage(selectedPackage);

    if (droppedFiles.length + files.length > maxImages) {
      toast.error(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Kufizim i paketës!</div>
          <div className="text-sm">Paketa juaj lejon maksimumi {maxImages} foto. Ju lutem përmirësoni paketën për më shumë.</div>
        </div>,
        {
          duration: 4000,
          position: 'top-center',
          icon: '⚠️',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
            minWidth: '300px',
          },
        }
      );
      return;
    }

    const validFiles = droppedFiles.filter(file => {
      if (file.size > 4.5 * 1024 * 1024) {
        toast.error(`File "${file.name}" është shumë i madh. Madhësia maksimale është 4.5MB`, {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
          },
        });
        return false;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error(`File "${file.name}" nuk është në formatin e duhur. Lejohen vetëm PNG, JPG ose JPEG`, {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
          },
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPackage = e.target.value;
    const maxImages = getMaxImagesForPackage(newPackage);
    
    if (files.length > maxImages) {
      toast.error(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Kufizim i paketës së re!</div>
          <div className="text-sm">Ju keni {files.length} foto të zgjedhura. Paketa e re lejon vetëm {maxImages} foto.</div>
        </div>,
        {
          duration: 4000,
          position: 'top-center',
          icon: '⚠️',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
          },
        }
      );
      return;
    }
    
    setSelectedPackage(newPackage);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length || !name || !email || (!recaptchaValue && !isLocalhost)) {
      toast.error(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Ju lutem plotësoni të gjitha fushat e kërkuara</div>
          <div className="text-sm">{!recaptchaValue && !isLocalhost ? "Ju lutem verifikoni që nuk jeni robot" : "Plotësoni të gjitha fushat"}</div>
        </div>,
        {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
          },
        }
      );
      return;
    }

    const loadingToast = toast.loading(
      <div className="flex flex-col space-y-2">
        <div className="font-medium">Duke përpunuar imazhet tuaja...</div>
        <div className="text-sm opacity-90">Kjo mund të marrë disa sekonda</div>
        <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-progress"></div>
        </div>
      </div>,
      {
        position: 'top-center',
        style: {
          background: '#EFF6FF',
          color: '#1E40AF',
          padding: '16px',
          borderRadius: '10px',
          minWidth: '300px',
        },
      }
    );

    try {
      const chunkSize = 2;
      const chunks = [];
      for (let i = 0; i < files.length; i += chunkSize) {
        const chunk = files.slice(i, i + chunkSize);
        chunks.push(chunk);
      }

      let sessionId = '';
      const uploadResults = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('recaptchaToken', recaptchaValue || '');
        chunk.forEach((file, index) => {
          formData.append(`image${i * chunkSize + index}`, file);
        });
        formData.append('styleStrength', styleStrength);
        formData.append('watermark', watermark.toString());
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', chunks.length.toString());
        formData.append('totalImages', files.length.toString());
        
        if (sessionId) {
          formData.append('sessionId', sessionId);
        }

        const response = await fetch('/api/generate-images', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error uploading chunk ${i + 1}`);
        }

        const result = await response.json();
        uploadResults.push(result);
        
        if (!sessionId && result.sessionId) {
          sessionId = result.sessionId;
        }

        // Update progress toast
        const progress = ((i + 1) / chunks.length) * 100;
        toast.loading(
          <div className="flex flex-col space-y-2">
            <div className="font-medium">Duke ngarkuar imazhet...</div>
            <div className="text-sm opacity-90">
              Chunk {i + 1} nga {chunks.length} ({Math.round(progress)}%)
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.processedChunks?.length || 0} chunks processed
            </div>
          </div>,
          {
            id: loadingToast,
            position: 'top-center',
            style: {
              background: '#EFF6FF',
              color: '#1E40AF',
              padding: '16px',
              borderRadius: '10px',
              minWidth: '300px',
            },
          }
        );
      }

      // Reset reCAPTCHA after successful upload
      if (!isLocalhost && recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaValue(null);
      }

      toast.success(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Imazhet u ngarkuan me sukses! 🎨</div>
          <div className="text-sm">Do të merrni një email sapo të përfundojë përpunimi.</div>
        </div>,
        {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#ECFDF5',
            color: '#065F46',
            padding: '16px',
            borderRadius: '10px',
            minWidth: '300px',
          },
        }
      );

      // Trigger confetti
      setShowConfetti(true);

      // Reset form
      setFiles([]);
      setImagePreviews([]);
      setName('');
      setEmail('');
      setStyleStrength('standard');
      setWatermark(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Gabim gjatë ngarkimit të imazheve</div>
          <div className="text-sm">Ju lutemi provoni përsëri më vonë.</div>
        </div>,
        {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
            minWidth: '300px',
          },
        }
      );
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm relative">
      {showConfetti && windowDimensions.width > 0 && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#60A5FA', '#34D399', '#F472B6', '#A78BFA', '#FBBF24']}
          tweenDuration={5000}
        />
      )}
      <style>{styles}</style>
      <Toaster />
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">
          <span className="block text-4xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Animazh.com</span>
          <span className="block text-6xl mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">Ghibli</span>
          <span className="block text-2xl text-gray-600 mt-4">Gjeneratori Falas i AI Ghibli</span>
        </h1>
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-gray-600">Duke krijuar magji për më shumë se</span>
          <span className="font-bold text-blue-600">802</span>
          <span className="text-gray-600">krijues</span>
        </div>
        <button
          onClick={scrollToForm}
          className="mt-8 inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer text-lg font-semibold"
        >
          Provo Transformimin Tënd
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Gjenero Imazh me AI
      </h2>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        Pas ngarkimit të imazhit tuaj, ekipi ynë i specializuar do të gjenerojë versionin Studio Ghibli AI dhe do ta dërgojë në email-in tuaj brenda 24 orëve. Shumica e imazheve përpunohen dhe dërgohen shumë më shpejt. Do t'ju njoftojmë sapo imazhi juaj të jetë gati!
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
          <svg className="w-full h-full text-blue-100 opacity-50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-7.5v-6a1 1 0 10-2 0v6a1 1 0 102 0zm0 4a1 1 0 10-2 0 1 1 0 102 0z"/>
          </svg>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold text-blue-600 mb-2">802</div>
            <div className="text-sm text-gray-600">foto të transformuara deri më sot</div>
          </div>
          
          <div className="flex-1 max-w-lg relative overflow-hidden">
            <div 
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTopTestimonial * 100}%)` }}
            >
              <div className="flex">
                {topTestimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                          {testimonial.initial}
                        </div>
                        <div className="flex-grow min-w-0">
                          <span className="text-gray-800 text-sm font-medium truncate block">{testimonial.name}</span>
                          <p className="text-gray-500 text-xs">{testimonial.role}</p>
                        </div>
                        <div className="flex text-yellow-400 text-sm ml-auto">
                          {'★'.repeat(5)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm italic">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-3 space-x-1">
              {topTestimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    currentTopTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTopTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-[1800px] mx-auto px-6 py-16 mb-12 bg-gradient-to-b from-white to-blue-50">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Shembuj të Transformimeve të Ndryshme
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Zbuloni se si AI jonë transformon imazhet e përditshme në vepra arti në stilin Studio Ghibli
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cat in Nature */}
          <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group">
            <div className="relative aspect-[1/1] w-full">
              <Image
                src="https://photointocartoon.com/images/examples/studio_01.jpg"
                alt="Mace në natyrë"
                fill
                style={{ objectFit: 'contain', backgroundColor: '#f8fafc' }}
                className="transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Kafshët Shtëpiake</h3>
              <p className="text-gray-600">Transformoni kafshët tuaja të dashura në karaktere anime të stilit Ghibli.</p>
            </div>
          </div>

          {/* Family Dinner */}
          <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group">
            <div className="relative aspect-[1/1] w-full">
              <Image
                src="https://photointocartoon.com/images/examples/studio_02.jpg"
                alt="Darka familjare"
                fill
                style={{ objectFit: 'contain', backgroundColor: '#f8fafc' }}
                className="transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Momentet Familjare</h3>
              <p className="text-gray-600">Ktheni kujtimet tuaja familjare në skena magjike.</p>
            </div>
          </div>

          {/* Crossing Guard */}
          <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group">
            <div className="relative aspect-[1/1] w-full">
              <Image
                src="https://photointocartoon.com/images/examples/studio_04.jpg"
                alt="Roja e kalimit"
                fill
                style={{ objectFit: 'contain', backgroundColor: '#f8fafc' }}
                className="transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Skenat e Përditshme</h3>
              <p className="text-gray-600">Zbuloni magji në momentet e zakonshme.</p>
            </div>
          </div>

          {/* Bridge Cyclist */}
          <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group">
            <div className="relative aspect-[1/1] w-full">
              <Image
                src="https://photointocartoon.com/images/examples/studio_05.jpg"
                alt="Çiklisti në urë"
                fill
                style={{ objectFit: 'contain', backgroundColor: '#f8fafc' }}
                className="transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Aventurat në Natyrë</h3>
              <p className="text-gray-600">Transformoni udhëtimet tuaja në përralla vizuale.</p>
            </div>
          </div>

          {/* Puppy */}
          <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group">
            <div className="relative aspect-[1/1] w-full">
              <Image
                src="https://photointocartoon.com/images/examples/studio_06.jpg"
                alt="Qeni i vogël"
                fill
                style={{ objectFit: 'contain', backgroundColor: '#f8fafc' }}
                className="transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Portrete Kafshësh</h3>
              <p className="text-gray-600">Krijoni portrete të paharrueshme të kafshëve tuaja.</p>
            </div>
          </div>

          {/* Park Scene */}
          <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group">
            <div className="relative aspect-[1/1] w-full">
              <Image
                src="https://photointocartoon.com/images/examples/studio_08.jpg"
                alt="Skena në park"
                fill
                style={{ objectFit: 'contain', backgroundColor: '#f8fafc' }}
                className="transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Momente të Qeta</h3>
              <p className="text-gray-600">Kapni paqen e momenteve të përditshme.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 max-w-3xl mx-auto">
          <p className="text-gray-600 text-lg leading-relaxed">
            Çdo imazh transformohet me kujdes për të ruajtur detajet origjinale ndërsa shton magjinë e stilit Studio Ghibli. 
            Perfekt për kujtime personale, projekte kreative, ose thjesht për të parë botën tuaj në një dritë të re magjike.
          </p>
          <button
            onClick={scrollToForm}
            className="mt-8 inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer text-lg font-semibold"
          >
            Provo Transformimin Tënd
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Paketat Tona
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Zgjidhni paketën që përshtatet më mirë me nevojat tuaja. Të gjitha paketat përfshijnë cilësi të lartë dhe support të dedikuar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Free Plan */}
          <div className="relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900">Paketa Bazë</h3>
                <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                  Fillestare
                </span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-semibold tracking-tight text-gray-900">FALAS</span>
                </div>
                <p className="text-gray-600">Përjetoni magjinë e transformimit</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>1 transformim foto</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Cilësi standarde</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Support bazë</span>
                </li>
              </ul>
            </div>

            <div className="p-8 border-t border-gray-100 mt-auto">
              <button
                onClick={scrollToForm}
                className="w-full py-3 px-6 rounded-lg bg-white text-gray-900 font-medium border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Fillo Tani
              </button>
            </div>
          </div>

          {/* Popular Plan */}
          <div className="relative flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 md:-mt-4">
            <div className="absolute -top-5 left-0 right-0 mx-auto w-max">
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-full shadow-sm">
                MË E PËRDORUR
              </span>
            </div>

            <div className="p-8 pt-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900">Paketa Standard</h3>
                <span className="inline-flex px-3 py-1 text-sm font-medium bg-purple-50 text-purple-700 rounded-full">
                  Popullore
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-semibold tracking-tight text-gray-900">3€</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-500 line-through">5€</span>
                    <span className="text-sm font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full whitespace-nowrap">40% ZBRITJE</span>
                  </div>
                </div>
                <p className="text-gray-600">Perfekte për projekte personale</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>5 transformime fotosh</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Cilësi premium</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Support prioritare</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Kurseni 40%</span>
                </li>
              </ul>
            </div>

            <div className="p-8 border-t border-gray-100 mt-auto">
              <button
                onClick={scrollToForm}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm"
              >
                Zgjidh Këtë Paketë
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900">Paketa Pro</h3>
                <span className="inline-flex px-3 py-1 text-sm font-medium bg-pink-50 text-pink-700 rounded-full">
                  Premium
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-semibold tracking-tight text-gray-900">5€</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-500 line-through">10€</span>
                    <span className="text-sm font-medium text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full whitespace-nowrap">50% ZBRITJE</span>
                  </div>
                </div>
                <p className="text-gray-600">Për profesionistët dhe studiot</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>10 transformime fotosh</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Cilësi Ultra HD</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Support VIP 24/7</span>
                </li>
                <li className="flex items-start text-gray-600">
                  <CheckIcon className="h-5 w-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Kurseni 50%</span>
                </li>
              </ul>
            </div>

            <div className="p-8 border-t border-gray-100 mt-auto">
              <button
                onClick={scrollToForm}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium hover:from-pink-700 hover:to-pink-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-sm"
              >
                Zgjidh Paketën Pro
              </button>
            </div>
          </div>
        </div>
      </div>

      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="space-y-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl max-w-2xl mx-auto mt-12"
      >
        <div>
          <label htmlFor="name" className="block text-gray-800 text-lg font-medium mb-2">
            Emri juaj <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-800 text-lg font-medium mb-2">
            Email Adresa <span className="text-red-500">*</span>
          </label>
          <p className="text-gray-600 text-sm mb-2">
            Imazhet e gjeneruara do të dërgohen në këtë adresë. Ju lutemi kontrolloni dhe sigurohuni që është e saktë.
          </p>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-medium mb-2">
            Stili i anime <span className="text-red-500">*</span>
          </label>
          <p className="text-gray-600 text-sm mb-2">
            Në cilin stil dëshironi t'i konvertoni fotot tuaja?
          </p>
          <select 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            value={styleStrength}
            onChange={(e) => setStyleStrength(e.target.value)}
          >
            <option value="ghibli">Stil Ghibli (magjik dhe nostalgji)</option>
       
          </select>
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-medium mb-2">
            Zgjidhni paketën tuaj <span className="text-red-500">*</span>
          </label>
          <p className="text-gray-600 text-sm mb-2">
            Ju lutemi sigurohuni që paketa e zgjedhur përputhet me numrin e fotove që do të ngarkoni.
          </p>
          <select 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            value={selectedPackage}
            onChange={handlePackageChange}
          >
            <option value="1">FREE për 1 foto</option>
            <option value="5">€3.00 për 5 foto (40% OFF)</option>
            <option value="10">€5.00 për 10 foto (50% OFF)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-800 text-lg font-medium mb-2">
            Ngarkoni foto(t) tuaja <span className="text-red-500">*</span>
          </label>
          <p className="text-gray-600 text-sm mb-2">
            Mund të ngarkoni deri në {getMaxImagesForPackage(selectedPackage)} foto. Madhësia maksimale e file-it 4.5MB për imazh.
          </p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-all duration-200 bg-white"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Parapamje ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {imagePreviews.length < getMaxImagesForPackage(selectedPackage) && (
                  <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        Shto më shumë foto
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-4 text-base text-gray-700 font-medium">
                  Klikoni për të zgjedhur file ose tërhiqeni dhe lëshojeni këtu
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Pranon file-et e imazheve
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Limiti i madhësisë: 4.5 MB
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg"
              multiple
              className="hidden"
            />
          </div>
        </div>

        {/* Only show reCAPTCHA in production */}
        {!isLocalhost && (
          <div className="flex justify-center mb-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={(value) => setRecaptchaValue(value)}
              theme="light"
              size="normal"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-8"
        >
          Gjenero {files.length > 0 ? `${files.length} Imazhe` : 'Imazhet'}
        </button>
      </form>

      <div className="mt-12 border-t pt-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Transformimet Magjike në Stilin Studio Ghibli
        </h3>
        
        <div className="space-y-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-3 transform transition duration-300 hover:scale-[1.02]">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="https://s.magicaitool.com/glibli-example/origin2.jpg"
                  alt="Imazhi origjinal 1"
                  width={400}
                  height={300}
                  className="object-cover transform transition duration-500 hover:scale-110"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Imazhi Origjinal</p>
                <p className="text-xs text-gray-500 mt-1">Para transformimit</p>
              </div>
            </div>
            <div className="space-y-3 transform transition duration-300 hover:scale-[1.02]">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="https://s.magicaitool.com/glibli-example/result2.jpg"
                  alt="Imazhi në stilin Ghibli 1"
                  width={400}
                  height={300}
                  className="object-cover transform transition duration-500 hover:scale-110"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Stili Studio Ghibli AI</p>
                <p className="text-xs text-gray-500 mt-1">Pas transformimit magjik</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-3 transform transition duration-300 hover:scale-[1.02]">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="https://s.magicaitool.com/glibli-example/origin3.jpg"
                  alt="Imazhi origjinal 2"
                  width={400}
                  height={300}
                  className="object-cover transform transition duration-500 hover:scale-110"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Imazhi Origjinal</p>
                <p className="text-xs text-gray-500 mt-1">Para transformimit</p>
              </div>
            </div>
            <div className="space-y-3 transform transition duration-300 hover:scale-[1.02]">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="https://s.magicaitool.com/glibli-example/result3.jpg"
                  alt="Imazhi në stilin Ghibli 2"
                  width={400}
                  height={300}
                  className="object-cover transform transition duration-500 hover:scale-110"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Stili Studio Ghibli AI</p>
                <p className="text-xs text-gray-500 mt-1">Pas transformimit magjik</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3 transform transition duration-300 hover:scale-[1.02]">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="https://s.magicaitool.com/glibli-example/origin1.jpg"
                  alt="Imazhi origjinal 3"
                  width={400}
                  height={300}
                  className="object-cover transform transition duration-500 hover:scale-110"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Imazhi Origjinal</p>
                <p className="text-xs text-gray-500 mt-1">Para transformimit</p>
              </div>
            </div>
            <div className="space-y-3 transform transition duration-300 hover:scale-[1.02]">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="https://s.magicaitool.com/glibli-example/result1.jpg"
                  alt="Imazhi në stilin Ghibli 3"
                  width={400}
                  height={300}
                  className="object-cover transform transition duration-500 hover:scale-110"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Stili Studio Ghibli AI</p>
                <p className="text-xs text-gray-500 mt-1">Pas transformimit magjik</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Çfarë Thonë Përdoruesit Tanë
        </h3>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="w-full flex-shrink-0 px-2 sm:px-4"
              >
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto max-w-lg">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mb-4">
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white text-base sm:text-xl font-semibold flex-shrink-0`}>
                      {testimonial.initial}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                    <div className="flex text-yellow-400 text-sm sm:ml-auto">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {testimonial.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <span className="text-blue-600 font-medium">4.9</span>
            <div className="flex text-yellow-400 text-sm">
              {'★'.repeat(5)}
            </div>
            <span className="text-gray-500 text-sm">nga 685 vlerësime</span>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-600 text-center font-medium">
          * Rezultatet mund të ndryshojnë bazuar në imazhin origjinal. Çdo transformim është unik.
        </p>
        <p className="text-sm text-gray-600 text-center">
          Shembujt tregojnë transformime të ndryshme: peizazhe, portrete dhe skena të përditshme në stilin magjik të Studio Ghibli.
        </p>
      </div>
    </div>
  );
};

export default ImageUploadForm; 