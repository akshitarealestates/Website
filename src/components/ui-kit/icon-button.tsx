import type { ComponentType, SVGProps } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconButtonVariant = 'gold' | 'espresso' | 'outline';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  className?: string;
  'aria-hidden'?: boolean;
  label?: string;
}

const VARIANTS: Record<IconButtonVariant, string> = {
  gold: 'bg-gold text-white shadow-[0_6px_16px_-6px_rgba(43,33,24,0.45)]',
  espresso: 'bg-ink text-cream shadow-[0_6px_16px_-6px_rgba(43,33,24,0.45)]',
  outline: 'border border-ink/12 bg-surface/80 text-ink backdrop-blur',
};

const SIZES: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-[38px] w-[38px]',
  lg: 'h-11 w-11',
};

const ICON_SIZES: Record<IconButtonSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-[18px] w-[18px]',
  lg: 'h-5 w-5',
};

/**
 * Reusable circular icon button. Renders a non-interactive decorative element
 * by default (used inside larger clickable cards/links). Pass `label` to make it
 * an accessible standalone affordance.
 */
export function IconButton({
  icon: Icon = ArrowUpRight,
  variant = 'gold',
  size = 'md',
  className,
  label,
}: IconButtonProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-luxe',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      <Icon className={ICON_SIZES[size]} />
    </span>
  );
}
