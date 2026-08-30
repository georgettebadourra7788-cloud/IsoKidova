export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" aria-hidden="true" />
    </div>
  );
}
