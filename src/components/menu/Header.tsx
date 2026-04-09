export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-olive-deep/95 backdrop-blur-md border-b border-sage/10">
      <div className="flex flex-col items-center justify-center py-5">
        <img src="/favicon.svg" alt="B" className="h-14 w-auto" />
        <div className="w-8 h-px bg-terracotta my-2" />
        <p className="font-accent text-base italic text-sage tracking-[0.4em]">
          Ibiza
        </p>
      </div>
    </header>
  );
}
