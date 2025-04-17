"use client";

import Image from "next/image";

const ExamplesSection = () => {
  return (
    <section className="container mx-auto px-4 py-10 md:px-6 mb-16">
      <h2 className="text-2xl font-bold text-center mb-10">
        Ghibli Studio & Ghibli AI Images Example
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Example 1 */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src="https://ext.same-assets.com/959849943/1544859771.jpeg"
              alt="Original photo 1"
              width={400}
              height={300}
              className="w-full h-auto"
            />
          </div>
          <div className="flex justify-center">
            <Image
              src="https://ext.same-assets.com/959849943/2628463528.svg"
              alt="Arrow"
              width={24}
              height={24}
              className="rotate-90 md:rotate-0"
            />
          </div>
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src="https://ext.same-assets.com/959849943/3728330511.jpeg"
              alt="Ghibli result 1"
              width={400}
              height={300}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Example 2 */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src="https://ext.same-assets.com/959849943/2001191165.jpeg"
              alt="Original photo 2"
              width={400}
              height={300}
              className="w-full h-auto"
            />
          </div>
          <div className="flex justify-center">
            <Image
              src="https://ext.same-assets.com/959849943/2628463528.svg"
              alt="Arrow"
              width={24}
              height={24}
              className="rotate-90 md:rotate-0"
            />
          </div>
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src="https://ext.same-assets.com/959849943/360681501.jpeg"
              alt="Ghibli result 2"
              width={400}
              height={300}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Example 3 */}
        <div className="space-y-4 hidden lg:block">
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src="https://ext.same-assets.com/959849943/3527604139.jpeg"
              alt="Original photo 3"
              width={400}
              height={300}
              className="w-full h-auto"
            />
          </div>
          <div className="flex justify-center">
            <Image
              src="https://ext.same-assets.com/959849943/2628463528.svg"
              alt="Arrow"
              width={24}
              height={24}
              className="rotate-90 md:rotate-0"
            />
          </div>
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src="https://ext.same-assets.com/959849943/3642932601.jpeg"
              alt="Ghibli result 3"
              width={400}
              height={300}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;
