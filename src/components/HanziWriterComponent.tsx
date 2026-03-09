import React, { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';

interface HanziWriterProps {
  character: string;
  width?: number;
  height?: number;
  animate?: boolean;
}

export const HanziWriterComponent: React.FC<HanziWriterProps> = ({
  character,
  width = 150,
  height = 150,
  animate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);

  useEffect(() => {
    if (!containerRef.current || !character) return;

    // Clear previous
    containerRef.current.innerHTML = '';

    writerRef.current = HanziWriter.create(containerRef.current, character, {
      width,
      height,
      padding: 5,
      showOutline: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 100,
    });

    if (animate) {
      writerRef.current.animateCharacter();
    }

    return () => {
      // Cleanup if needed
    };
  }, [character, width, height, animate]);

  const handleReplay = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleReplay}
      className="cursor-pointer border border-gray-200 rounded-lg bg-white shadow-sm flex items-center justify-center"
      style={{ width, height }}
      title="Click to replay animation"
    />
  );
};
