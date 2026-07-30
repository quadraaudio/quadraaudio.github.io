"use client";

import EditorAuthShell from "@/components/editor/EditorAuthShell";
import EditorHub from "@/components/editor/EditorHub";

export default function EditorIndexPage() {
  return (
    <EditorAuthShell>
      <EditorHub />
    </EditorAuthShell>
  );
}
