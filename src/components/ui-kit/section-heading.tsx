import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  overline?: string;
  title: string;
  italicWord?: string;
  className?: string;
}

export function SectionHeading({ overline, title, italicWord, className }: SectionHeadingProps) {
  const renderTitle = () => {
    if (!italicWord) return title;
    const idx = title.toLowerCase().indexOf(italicWord.toLowerCase());
    if (idx === -1) return title;
    const before = title.slice(0, idx);
    const matched = title.slice(idx, idx + italicWord.length);
    const after = title.slice(idx + italicWord.length);
    return (
      <>
        {before}
        <em className="italic font-normal">{matched}</em>
        {after}
      </>
    );
  };

  return (
    <div className={cn('', className)}>
      {overline && (
        <p className="text-xs uppercase tracking-[0.2em] text-ink/50 mb-3">{overline}</p>
      )}
      <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl text-ink">
        {renderTitle()}
      </h2>
    </div>
  );
}
