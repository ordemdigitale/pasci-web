import { ImageWithFallback } from "@/lib/imageWithFallback"

interface IPartenaires {
  id: number;
  name: string;
  imageUrl: string;
}

export default function Partners() {
  const partners: IPartenaires[] = [
    { id: 1, name: 'Save The Children', imageUrl: "/images/partenaires/save-the-children.png" },
    { id: 2, name: 'CERAP', imageUrl: '/images/partenaires/cerap.png' },
    { id: 3, name: 'Social Justice', imageUrl: '/images/partenaires/social-justice.png' },
    { id: 4, name: 'Union Européenne', imageUrl: '/images/partenaires/union-europeenne.png' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-gray-900 font-bold text-3xl">Nos partenaires</h2>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-6"
            >
              <div className="text-center">
                <div className="mx-auto rounded-full flex items-center justify-center mb-2">
                  <ImageWithFallback
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="object-contain"
                    width={170}
                    height={200}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
