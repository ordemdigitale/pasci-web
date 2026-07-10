"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Search, X } from "lucide-react";

export type AssociationOption = {
  id: string | number;
  name: string;
  subtitle?: string | null;
};

type SearchableAssociationSelectProps = {
  label: string;
  value?: string;
  options: AssociationOption[];
  placeholder: string;
  searchPlaceholder: string;
  onChange: (value: string) => void;
  onSearchChange?: (query: string) => void;
  loading?: boolean;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function SearchableAssociationSelect({
  label,
  value = "",
  options,
  placeholder,
  searchPlaceholder,
  onChange,
  onSearchChange,
  loading = false,
}: SearchableAssociationSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => String(option.id) === value);

  useEffect(() => {
    if (!onSearchChange) return;
    const timeout = window.setTimeout(() => {
      onSearchChange(query);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [onSearchChange, query]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return options.slice(0, 30);

    const startsWith = options.filter((option) =>
      normalize(option.name).startsWith(normalizedQuery)
    );
    const contains = options.filter((option) => {
      const name = normalize(option.name);
      return !name.startsWith(normalizedQuery) && name.includes(normalizedQuery);
    });

    return [...startsWith, ...contains].slice(0, 30);
  }, [options, query]);

  function handleSelect(option: AssociationOption) {
    onChange(String(option.id));
    setQuery("");
    setOpen(false);
  }

  function handleClear() {
    onChange("");
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
          >
            <X className="w-3.5 h-3.5" />
            Retirer
          </button>
        )}
      </div>

      {selectedOption ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border border-[#2A591D]/30 bg-[#2A591D]/5 rounded-lg">
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{selectedOption.name}</p>
            {selectedOption.subtitle && (
              <p className="text-xs text-gray-500 truncate">{selectedOption.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600"
            aria-label={`Retirer ${label}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : value ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border border-[#2A591D]/30 bg-[#2A591D]/5 rounded-lg">
          <p className="font-medium text-gray-900 truncate">Sélection #{value}</p>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600"
            aria-label={`Retirer ${label}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all text-gray-500"
        >
          {placeholder}
        </button>
      )}

      {(open || !value) && (
        <div className="mt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all"
            />
            {loading && (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {open && (
            <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start justify-between gap-3"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-gray-900 truncate">
                        {option.name}
                      </span>
                      {option.subtitle && (
                        <span className="block text-xs text-gray-500 truncate">
                          {option.subtitle}
                        </span>
                      )}
                    </span>
                    {String(option.id) === value && (
                      <Check className="w-4 h-4 text-[#2A591D] flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-4 text-sm text-gray-500">
                  Aucun résultat trouvé.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
