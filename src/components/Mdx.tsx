import { compileMDX } from "next-mdx-remote/rsc";
import { Prose } from "./Prose";
export async function Mdx({ source }: { source: string }) {
  const { content } = await compileMDX({ source });
  return <Prose>{content}</Prose>;
}
