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
    <div className="py-2 px-4 text-center relative z-50" style={{ backgroundColor: '#13204A', color: '#EDE7DC' }}>
      <p className="text-[11px] uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
        {message}{' '}
        <a href={linkHref} className="underline hover:no-underline whitespace-nowrap">
          {linkText}
        </a>
      </p>
    </div>
  );
}
