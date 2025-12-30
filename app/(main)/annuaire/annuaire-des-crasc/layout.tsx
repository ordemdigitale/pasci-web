import React from 'react'
import AnnuaireCrascHeader from '@/components/crasc/AnnuaireCrascHeader';

export default function CRASCLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      {/* Common elements for ALL CRASC pages */}
      <AnnuaireCrascHeader />
      <div className="crasc-content">
        {children}
      </div>
    </section>
  )
}
