// ============================================================
// Funnel Builders — Loader Component
// Premium dot-bounce loader
// ============================================================

export interface LoaderProps {
  size?: 'sm' | 'md';
  fullPage?: boolean;
}

export default function Loader({ size = 'md', fullPage = false }: LoaderProps) {
  if (fullPage) {
    return (
      <div className="page-loader">
        <div className="loader-dots">
          <div className="loader-dots__dot" />
          <div className="loader-dots__dot" />
          <div className="loader-dots__dot" />
        </div>
      </div>
    );
  }

  if (size === 'sm') {
    return <div className="spinner spinner--sm" />;
  }

  return (
    <div className="loader-dots">
      <div className="loader-dots__dot" />
      <div className="loader-dots__dot" />
      <div className="loader-dots__dot" />
    </div>
  );
}
