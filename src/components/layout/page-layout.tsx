import React from 'react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <>
      <div className="gradient-bg">
        <div className="container-custom pt-32 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{title}</h1>
            {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container-custom py-16">
          <div className="prose lg:prose-xl max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}