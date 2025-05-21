import TextAnalyzer from "@/components/TextAnalyzer";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        글자수세기
      </h1>
      <TextAnalyzer />
    </main>
  );
}
