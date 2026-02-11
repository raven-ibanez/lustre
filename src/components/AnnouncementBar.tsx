interface AnnouncementBarProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export function AnnouncementBar({
  message = "Free shipping nationwide for orders over ₱5,000",
  linkText = "Shop Now",
  linkHref = "#shop"
}: AnnouncementBarProps) {
  return (
    <div className="bg-forest text-white py-2 px-4 text-center relative z-50">
      <p className="text-[11px] uppercase tracking-wider">
        {message}{' '}
        <a href={linkHref} className="underline hover:no-underline">
          {linkText}
        </a>
      </p>
    </div>
  );
}
