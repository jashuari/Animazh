"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import ReactConfetti from 'react-confetti';
import Script from 'next/script';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const styles = `
  @keyframes progress {
    0% { width: 0% }
    100% { width: 100% }
  }
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`;

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isLocalhost = process.env.NODE_ENV === 'development';
  const maxRetries = 3;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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
    
    // Calculate total number of files after adding new ones
    const totalFiles = files.length + selectedFiles.length;
    
    if (totalFiles > maxImages) {
      toast.error(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Kufizim i paketës!</div>
          <div className="text-sm">
            Paketa juaj lejon maksimumi {maxImages} foto. 
            {files.length > 0 
              ? ` Ju keni ${files.length} foto të zgjedhura dhe po provoni të shtoni ${selectedFiles.length} të tjera.`
              : ''
            }
          </div>
          <div className="text-sm font-medium text-blue-600 mt-1">
            Ju lutem përmirësoni paketën për më shumë ose fshini disa foto ekzistuese.
          </div>
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
      // Reset the file input to allow selecting the same files again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
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
          <div className="text-sm">
            Ju keni {files.length} foto të zgjedhura. Paketa e re lejon vetëm {maxImages} foto.
            Ju lutem fshini disa foto para se të ndryshoni paketën.
          </div>
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

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate new dimensions while maintaining aspect ratio
          const maxWidth = 1920;
          const maxHeight = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            0.8
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  interface UploadState {
    sessionId: string;
    uploadResults: any[];
    failedUploads: Array<{ index: number; retries: number }>;
    loadingToast: string;
  }

  const executeRecaptcha = async () => {
    try {
      if (!RECAPTCHA_SITE_KEY) {
        throw new Error('reCAPTCHA site key is not defined');
      }
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit_form' });
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      throw new Error('Failed to execute reCAPTCHA');
    }
  };

  const uploadImage = async (
    index: number,
    retryCount = 0,
    uploadState: UploadState,
    recaptchaToken: string
  ): Promise<boolean> => {
    const maxRetryDelay = 10000;
    const baseDelay = 2000;
    const currentDelay = Math.min(baseDelay * Math.pow(2, retryCount), maxRetryDelay);
    
    try {
      const compressedImageBlob = await compressImage(files[index]);
      const compressedImageFile = new File([compressedImageBlob], files[index].name, {
        type: 'image/jpeg'
      });

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append(`image${index}`, compressedImageFile);
      formData.append('styleStrength', styleStrength);
      formData.append('watermark', watermark.toString());
      formData.append('imageIndex', index.toString());
      formData.append('totalImages', files.length.toString());
      formData.append('recaptchaToken', recaptchaToken);
      
      if (uploadState.sessionId) {
        formData.append('sessionId', uploadState.sessionId);
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch('/api/generate-images', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`Error uploading image ${index + 1}: ${response.statusText}`);
        }

        const result = await response.json();
        uploadState.uploadResults.push(result);
        
        if (!uploadState.sessionId && result.sessionId) {
          uploadState.sessionId = result.sessionId;
        }

        return true;
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      console.error(`Error uploading image ${index + 1}:`, error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`Upload timeout for image ${index + 1}, retrying...`);
      }
      
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        uploadState.failedUploads.push({ index, retries: retryCount + 1 });
        return false;
      }

      toast.error(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Nuk u arrit të ngarkohej imazhi {index + 1}</div>
          <div className="text-sm">Ju lutemi provoni përsëri më vonë</div>
        </div>,
        {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '10px',
          },
        }
      );
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length || !name || !email) {
      toast.error(
        <div className="flex flex-col space-y-1">
          <div className="font-medium">Ju lutem plotësoni të gjitha fushat e kërkuara</div>
          <div className="text-sm">Plotësoni të gjitha fushat</div>
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
        <div className="font-medium">Duke ngarkuar imazhet...</div>
        <div className="text-sm opacity-90">
          0 nga {files.length} imazhe të ngarkuara
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
      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha();

      const uploadState: UploadState = {
        sessionId: '',
        uploadResults: [],
        failedUploads: [],
        loadingToast: loadingToast
      };

      // Process images in smaller batches
      const batchSize = 3;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        await Promise.all(
          batch.map((_, batchIndex) => uploadImage(i + batchIndex, 0, uploadState, recaptchaToken))
        );

        // Update progress toast
        toast.loading(
          <div className="flex flex-col space-y-2">
            <div className="font-medium">Duke ngarkuar imazhet...</div>
            <div className="text-sm opacity-90">
              {uploadState.uploadResults.length} nga {files.length} imazhe të ngarkuara
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

        // Add a delay between batches
        if (i + batchSize < files.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Handle retries with increasing delays
      while (uploadState.failedUploads.length > 0) {
        const { index, retries } = uploadState.failedUploads.shift()!;
        const success = await uploadImage(index, retries, uploadState, recaptchaToken);
        if (!success && retries < maxRetries) {
          uploadState.failedUploads.push({ index, retries: retries + 1 });
        }
      }

      if (uploadState.uploadResults.length === files.length) {
        // Dismiss all toasts before showing success
        toast.dismiss();
        
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

        setShowConfetti(true);
        setFiles([]);
        setImagePreviews([]);
        setName('');
        setEmail('');
        setStyleStrength('standard');
        setWatermark(false);
      } else {
        toast.error(
          <div className="flex flex-col space-y-1">
            <div className="font-medium">Disa imazhe nuk u ngarkuan</div>
            <div className="text-sm">U ngarkuan {uploadState.uploadResults.length} nga {files.length} imazhe.</div>
          </div>,
          {
            duration: 7000,
            position: 'top-center',
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '16px',
              borderRadius: '10px',
            },
          }
        );
      }
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
          },
        }
      );
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />
      {/* Background wrapper */}
      <div className="fixed inset-0 min-h-screen w-full overflow-hidden -z-10">
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234299e1' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px'
          }}
        />
        
        {/* Main background image */}
        <Image
          src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//d5e50cce-433e-4b18-b28e-509fae08c589.png"
          alt="Background"
          fill
          className="opacity-70"
          style={{ 
            objectFit: 'cover',
            filter: 'saturate(1.2) brightness(1.1)'
          }}
          priority
        />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-blue-50/40 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative max-w-2xl mx-auto p-6">
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

        <div className="w-full max-w-[1800px] mx-auto px-6 py-16 mb-12 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
          <div className="relative">
            <h2 className="text-4xl font-bold text-center mb-3 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shembuj të Transformimeve të Ndryshme
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-lg font-normal leading-relaxed">
              Zbuloni se si AI jonë transformon imazhet e përditshme në vepra arti në stilin magjik të Studio Ghibli
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* First Row */}
              {/* Cat in Nature */}
              <div 
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white group cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleImageClick("https://photointocartoon.com/images/examples/studio_01.jpg")}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://photointocartoon.com/images/examples/studio_01.jpg"
                    alt="Mace në natyrë"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 p-6 text-center">Miqtë Tanë të Vegjël</h3>
              </div>

              {/* Family Dinner */}
              <div 
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white group cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleImageClick("https://photointocartoon.com/images/examples/studio_02.jpg")}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://photointocartoon.com/images/examples/studio_02.jpg"
                    alt="Darka familjare"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 p-6 text-center">👨‍👩‍👧‍Momentet Familjare</h3>
              </div>

              {/* Nature Landscape */}
              <div 
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white group cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleImageClick("https://photointocartoon.com/images/examples/studio_03.jpg")}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://photointocartoon.com/images/examples/studio_03.jpg"
                    alt="Peizazh natyror"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 p-6 text-center">🌿 Peizazhe Natyrore</h3>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {/* Portrait */}
              <div 
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white group cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleImageClick("https://photointocartoon.com/images/examples/studio_04.jpg")}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://photointocartoon.com/images/examples/studio_04.jpg"
                    alt="Portret"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 p-6 text-center">Portrete Artistike</h3>
              </div>

              {/* Urban Scene */}
              <div 
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white group cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleImageClick("https://photointocartoon.com/images/examples/studio_05.jpg")}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://photointocartoon.com/images/examples/studio_05.jpg"
                    alt="Skena urbane"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 p-6 text-center">🌆 Skena Urbane</h3>
              </div>

              {/* Animals */}
              <div 
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white group cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleImageClick("https://photointocartoon.com/images/examples/studio_06.jpg")}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://photointocartoon.com/images/examples/studio_06.jpg"
                    alt="Kafshët Shtëpiake"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 p-6 text-center">🐶 Kafshë të Dashura</h3>
              </div>
            </div>

            <p className="text-gray-500 text-center mt-12 max-w-2xl mx-auto text-sm italic">
              Imazhet janë të gjeneruara në stilin Studio Ghibli, duke përdorur teknologji të avancuar të AI-së për të ruajtur detajet dhe emocionet e çdo fotoje.
            </p>
          </div>
        </div>

        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="space-y-8 bg-gray-50 p-8 rounded-xl"
        >
          {/* Package Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedPackage === '1' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedPackage('1')}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">FALAS</div>
                <div className="text-gray-600">1 foto</div>
              </div>
            </div>

            <div 
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedPackage === '5' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedPackage('5')}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3€</div>
                <div className="text-gray-600">5 foto</div>
                <div className="text-sm text-purple-600 font-medium">Zbritje 40%</div>
              </div>
            </div>

            <div 
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedPackage === '10' 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 hover:border-pink-300'
              }`}
              onClick={() => setSelectedPackage('10')}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">5€</div>
                <div className="text-gray-600">10 foto</div>
                <div className="text-sm text-pink-600 font-medium">Zbritje 50%</div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <div
              className="border-3 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-all duration-200 bg-white"
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
                        alt={`Foto ${index + 1}`}
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
                    <div className="flex items-center justify-center h-32 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-blue-400"
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
                        <p className="mt-2 text-blue-600 font-medium">
                          Shto foto të tjera
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-20 w-20 text-blue-400"
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
                  <p className="mt-4 text-xl text-blue-600 font-medium">
                    Kliko këtu për të zgjedhur foto
                  </p>
                  <p className="mt-2 text-gray-500">
                    ose tërhiq dhe lësho fotot këtu
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

          {/* Contact Info - Simplified */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium mb-2">
                Emri juaj <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Shkruaj emrin tuaj"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Shkruaj email-in tuaj"
              />
            </div>
          </div>

          {/* Submit Button and Label */}
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Transformo {files.length > 0 ? `${files.length} Foto` : 'Fotot'} Tani
            </button>
            <p className="text-center text-gray-600 text-sm">
              Pas ngarkimit të fotove, do t'ju dërgojmë një email sapo transformimi të jetë i gatshëm
            </p>
          </div>
        </form>

        {/* Before/After Gallery */}
        <div className="mt-16 bg-gradient-to-b from-gray-50 to-white py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Para dhe Pas Transformimit
          </h2>
          <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto px-6">
            {/* Example 1 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div 
                className="flex-1 relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//6384cb0e5e7ec.png")}
              >
                <Image
                  src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//6384cb0e5e7ec.png"
                  alt="Para transformimit"
                  fill
                  style={{ 
                    objectFit: 'contain',
                    backgroundColor: '#ffffff'
                  }}
                  quality={100}
                  priority
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                  Para
                </div>
              </div>
              <div 
                className="flex-1 relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//ChatGPT%20Image%20Apr%2018,%202025,%2003_02_27%20AM.png")}
              >
                <Image
                  src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//ChatGPT%20Image%20Apr%2018,%202025,%2003_02_27%20AM.png"
                  alt="Pas transformimit"
                  fill
                  style={{ 
                    objectFit: 'contain',
                    backgroundColor: '#ffffff'
                  }}
                  quality={100}
                  priority
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                  Pas
                </div>
              </div>
            </div>

            {/* Example 2 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div 
                className="flex-1 relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//Screenshot%202025-04-18%20030240.png")}
              >
                <Image
                  src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//Screenshot%202025-04-18%20030240.png"
                  alt="Para transformimit"
                  fill
                  style={{ 
                    objectFit: 'contain',
                    backgroundColor: '#ffffff'
                  }}
                  quality={100}
                  priority
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                  Para
                </div>
              </div>
              <div 
                className="flex-1 relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//ChatGPT%20Image%20Apr%2018,%202025,%2003_02_46%20AM.png")}
              >
                <Image
                  src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload//ChatGPT%20Image%20Apr%2018,%202025,%2003_02_46%20AM.png"
                  alt="Pas transformimit"
                  fill
                  style={{ 
                    objectFit: 'contain',
                    backgroundColor: '#ffffff'
                  }}
                  quality={100}
                  priority
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                  Pas
                </div>
              </div>
            </div>

            {/* Example 3 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div 
                className="flex-1 relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleImageClick("https://pbs.twimg.com/media/GnIgBkgXUAAX-vF?format=jpg&name=large")}
              >
                <Image
                  src="https://pbs.twimg.com/media/GnIgBkgXUAAX-vF?format=jpg&name=large"
                  alt="Para transformimit"
                  fill
                  style={{ 
                    objectFit: 'contain',
                    backgroundColor: '#ffffff'
                  }}
                  quality={100}
                  priority
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                  Pas
                </div>
              </div>
              <div 
                className="flex-1 relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleImageClick("https://pbs.twimg.com/media/GnIgEhJXMAAe-28?format=jpg&name=medium")}
              >
                <Image
                  src="https://pbs.twimg.com/media/GnIgEhJXMAAe-28?format=jpg&name=medium"
                  alt="Pas transformimit"
                  fill
                  style={{ 
                    objectFit: 'contain',
                    backgroundColor: '#ffffff'
                  }}
                  quality={100}
                  priority
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
                  Pas
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

        {/* Gallery Grid Section */}
        <div className="mt-16 mb-16 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-3 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Galeria e Transformimeve Ghibli
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-lg">
            Eksploroni botën magjike të transformimeve tona në stilin Studio Ghibli
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* First row */}
            <div 
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnKQRkca0AAnYlG.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnKQRkca0AAnYlG.jpg"
                alt="Ghibli transformation 1"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            <div 
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnKHqKjagAA_pCg.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnKHqKjagAA_pCg.jpg"
                alt="Ghibli transformation 2"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            <div 
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnKArXHaIAAZLjb.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnKArXHaIAAZLjb.jpg"
                alt="Ghibli transformation 3"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            <div 
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnJy5CJaMAAOIq-.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnJy5CJaMAAOIq-.jpg"
                alt="Ghibli transformation 4"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            {/* Second row - Large images */}
            <div 
              className="relative aspect-[16/9] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 col-span-2 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnJT8y_XkAA5qdx.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnJT8y_XkAA5qdx.jpg"
                alt="Ghibli transformation 5"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            <div 
              className="relative aspect-[16/9] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 col-span-2 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnJT8y-XEAAO2p1.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnJT8y-XEAAO2p1.jpg"
                alt="Ghibli transformation 6"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            {/* Third row */}
            <div 
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnIn1bTWYAATmHW.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnIn1bTWYAATmHW.jpg"
                alt="Ghibli transformation 7"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            <div 
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnIhb7NXQAAxDyu.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnIhb7NXQAAxDyu.jpg"
                alt="Ghibli transformation 8"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            <div 
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnIgDZAWYAALutO.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnIgDZAWYAALutO.jpg"
                alt="Ghibli transformation 9"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>

            <div 
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              onClick={() => handleImageClick("https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnA0cZTbYAAhmim.jpg")}
            >
              <Image
                src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/GnA0cZTbYAAhmim.jpg"
                alt="Ghibli transformation 10"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={90}
              />
            </div>
          </div>

          <p className="text-gray-500 text-center mt-12 text-sm italic">
            Klikoni në çdo imazh për ta parë në madhësi të plotë. Të gjitha transformimet janë bërë duke përdorur teknologjinë tonë të avancuar AI.
          </p>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt="Full size image"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUploadForm; 