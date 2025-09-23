// components/common/LogoWithSeparator.jsx
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export const LogoWithSeparator = () => {
  return (
    <div className="flex w-9/12 justify-center items-center gap-16">
      <Separator className="flex-1 bg-separator-color" />
      
      <div className="relative h-16 w-32 flex-shrink-0">
        <Image
          loading="eager"
          src="/img/logoDark.svg"
          alt="light mode"
          width={128}
          height={64}
          className="absolute inset-0 h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        />
        <Image
          loading="eager"
          src="/img/logoLight.svg"
          alt="dark mode"
          width={128}
          height={64}
          className="absolute inset-0 h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        />
      </div>

      <Separator className="flex-1 bg-separator-color" />
    </div>
  );
};