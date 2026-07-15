import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={cn("h-4 w-4", className)}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
      aria-hidden
    >
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
      aria-hidden
    >
      <path d="M22 12.2c0-2.4-.3-4-.6-4.7-.3-.8-.9-1.4-1.7-1.7C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.7.4c-.8.3-1.4.9-1.7 1.7-.3.8-.6 2.3-.6 4.7s.3 4 .6 4.7c.3.8.9 1.4 1.7 1.7 1.5.4 7.7.4 7.7.4s6.2 0 7.7-.4c.8-.3 1.4-.9 1.7-1.7.3-.8.6-2.3.6-4.7ZM10.2 15.2V9.2L15.5 12l-5.3 3.2Z" />
    </svg>
  );
}
