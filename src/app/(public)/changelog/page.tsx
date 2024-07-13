import PageHeader from "../_components/page-header";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import changelog from "~/../CHANGELOG.md";
import { Card, CardContent } from "~/components/ui/card";

export default function ChangelogPage() {
  return (
    <>
      <PageHeader>Changelog</PageHeader>

      <article className="prose xl:prose-xl container mx-auto">
        <Card>
          <CardContent>
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: Header1,
                h2: Header2,
                h3: Header3,
                p: Paragraph,
                ol: OrderedList,
                ul: UnorderedList,
                table: Table,
              }}
            >
              {String(changelog)}
            </Markdown>
          </CardContent>
        </Card>
      </article>
    </>
  );
}

function Header1(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className="mb-2 mt-6 text-5xl font-bold" {...props} />;
}

function Header2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className="mb-2 mt-6 text-3xl font-bold" {...props} />;
}

function Header3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className="mb-2 mt-6 text-xl font-bold" {...props} />;
}

function Paragraph(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className="mb-4" {...props} />;
}

function OrderedList(props: React.HTMLAttributes<HTMLOListElement>) {
  return <ol className="ml-8 list-decimal" {...props} />;
}

function UnorderedList(props: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className="ml-8 list-disc" {...props} />;
}

function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className="my-2 w-full table-auto rounded-lg border text-center"
      {...props}
    />
  );
}
