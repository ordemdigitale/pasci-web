"use client";

import dynamic from "next/dynamic";
import { TextEditorProps } from "./TextEditor";

// Dynamically import the TextEditor with no SSR
const TextEditor = dynamic(() => import("./TextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg min-h-[300px]">
      <div className="h-64 bg-gray-50 animate-pulse rounded-lg"></div>
    </div>
  ),
});

export default function ClientTextEditor(props: TextEditorProps) {
  return <TextEditor {...props} />;
}