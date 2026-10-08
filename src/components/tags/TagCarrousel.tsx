import s from "@/styles/components/tags/TagCarrousel.module.css";

type Props = {
  tags: string[];
  maxWidth?: string;
};

export default function TagCarrousel({ tags, maxWidth = "100%" }: Props) {
  return (
    <section className={s.tagContainer} style={{ maxWidth }}>
      {tags.map((tag) => (
        <span className={s.tag} key={tag}>
          {tag}
        </span>
      ))}
    </section>
  );
}
