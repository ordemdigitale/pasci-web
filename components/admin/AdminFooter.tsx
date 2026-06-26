export default function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Copyright © 2026 PdoC. Tous droits réservés.
        </p>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-[#2a591d] transition-colors">
            Aide
          </a>
          <a href="#" className="hover:text-[#2a591d] transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-[#2a591d] transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
}
