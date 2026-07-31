import { notFound } from "next/navigation";
import { SupportArticleLayout } from "@/components/SupportArticleLayout";
import {
  SUPPORT_ARTICLES,
  SUPPORT_ARTICLE_MAP,
} from "@/data/supportArticles";

export function generateStaticParams() {
  return SUPPORT_ARTICLES.map((article) => ({ id: article.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = SUPPORT_ARTICLE_MAP[id];
  if (!article) {
    return { title: "Support — Quadra" };
  }
  return {
    title: `${article.title} — Quadra Support`,
    description: article.summary,
  };
}

export default async function SupportArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = SUPPORT_ARTICLE_MAP[id];
  if (!article) notFound();

  const related = SUPPORT_ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id
  )
    .slice(0, 4)
    .map((a) => ({ id: a.id, title: a.title }));

  return (
    <SupportArticleLayout
      category={article.category}
      title={article.title}
      date={article.date}
      articleId={article.id}
      summary={article.summary}
      related={related}
    >
      {article.steps.map((step) => (
        <section key={step.heading}>
          <h2>{step.heading}</h2>
          <p>{step.text}</p>
          {step.bullets && step.bullets.length > 0 && (
            <ul>
              {step.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </SupportArticleLayout>
  );
}
