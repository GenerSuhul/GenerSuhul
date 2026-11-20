import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { projects } from "../content/projects.mjs";
test("six complete cases with explicit status and valid evidence files", async () => {
  assert.equal(projects.length,6);
  assert.equal(new Set(projects.map(p=>p.slug)).size,6);
  for(const project of projects) {
    for(const field of ["title","problem","solution","production","impact","sourceLabel"])assert(project[field]?.trim(),project.slug+":"+field);
    assert(project.implemented.length>0);assert(Array.isArray(project.pending));
    for(const evidence of project.evidence) {
      assert(evidence.caption);assert(evidence.alt);
      await access(new URL(".."+evidence.src,import.meta.url));
    }
    const html=await readFile(new URL("../casos/"+project.slug+"/index.html",import.meta.url),"utf8");
    assert(html.includes(project.title));
    assert(html.includes("Qué acredita la evidencia"));
  }
});
