
"use client"

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DynamicPexelsImageProps {
    hint: string;
    alt: string;
    className?: string;
}

export function DynamicPexelsImage({ hint, alt, className }: DynamicPexelsImageProps) {
    const { data: imageUrl, isLoading, isError } = useQuery({
        queryKey: ['pexelsImage', hint],
        queryFn: async () => {
            const response = await fetch(`/api/images?q=${encodeURIComponent(hint)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            return data.imageUrl;
        },
        enabled: !!hint,
        staleTime: Infinity, // Cache the image URL forever for the same hint
    });

    if (isLoading) {
        return <Skeleton className={cn("w-full h-full", className)} />;
    }

    // Fallback to a placeholder if there's an error or no URL
    const src = isError || !imageUrl ? `https://placehold.co/600x400.png` : imageUrl;

    return (
        <div className={cn("relative w-full h-full overflow-hidden", className)}>
             <Image 
                src={src} 
                alt={alt} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint={hint}
             />
        </div>
    )
}
