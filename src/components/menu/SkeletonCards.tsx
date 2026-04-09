export function ProductSkeleton() {
  return (
    <div className="space-y-6 px-4 py-6">
      {[1, 2].map((s) => (
        <div key={s} className="space-y-3">
          <div className="skeleton h-6 w-40" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-52 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DrinkSkeleton() {
  return (
    <div className="space-y-3 px-4 py-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div className="space-y-3 px-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}
