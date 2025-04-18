import React from 'react';
import Image from 'next/image';

const Logo = ({ className = "", size = 40 }: { className?: string; size?: number }) => {
  return (
    <Image
      src="https://nogkupvbcmrcrjqmibsi.supabase.co/storage/v1/object/public/upload/gallery/file.svg"
      alt="Animazh Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
};

export default Logo; 