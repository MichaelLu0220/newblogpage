import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BlogClientContent from '@/app/blog/[slug]/BlogClientContent';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    const filePath = path.join(process.cwd(), 'posts', `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return notFound();

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContent);

    // Calculate reading time based on word count
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Pre-render MDX content on server side
    const mdxContent = <MDXRemote source={content} />;

    return (
        <BlogClientContent 
            slug={slug}
            postData={{
                title: data.title, // 支援字串或 { en: string, zh: string } 格式
                date: data.date,
                category: data.category,
                tags: data.tags,
                content: content,
                readingTime: readingTime
            }}
            mdxContent={mdxContent}
        />
    );
}