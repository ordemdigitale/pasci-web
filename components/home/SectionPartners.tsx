export default function Partners() {
  const partners = [
    { id: 1, name: 'CRIPEN', color: '#4A90E2' },
    { id: 2, name: 'Save the Children', color: '#E74C3C' },
    { id: 3, name: 'European Union', color: '#003399' },
    { id: 4, name: 'Social Justice', color: '#3498DB' },
    { id: 5, name: 'INADES Formation', color: '#F39C12' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-gray-900 font-bold text-3xl">Nos partenaires</h2>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-6 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div 
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${partner.color}20` }}
                >
                  <div 
                    className="w-12 h-12 rounded-full"
                    style={{ backgroundColor: partner.color }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{partner.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
