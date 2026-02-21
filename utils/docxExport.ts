
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, Footer, Header } from 'docx';
import { saveAs } from 'file-saver';
import { FullEbook } from '../types';

export const exportToDocx = async (ebook: FullEbook) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Yugal Ebook AI • Professional Series",
                    size: 16,
                    color: "999999",
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Copyright © 2026 ${ebook.config.authorName} • Created by Yugal Ebook AI • Made in India by Yugal`,
                    size: 16,
                    color: "999999",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // Cover Page
          new Paragraph({
            text: ebook.outline.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 2000, after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Essential Wisdom & Practical Mastery",
                italics: true,
                size: 28,
                color: "666666",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Authored By",
                size: 20,
                allCaps: true,
                color: "999999",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: ebook.config.authorName,
                size: 36,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({ children: [new PageBreak()] }),

          // Introduction
          new Paragraph({
            text: "Introduction",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
          }),
          ...parseMarkdownToDocx(ebook.outline.introduction),

          new Paragraph({ children: [new PageBreak()] }),

          // Chapters
          ...ebook.chapters.flatMap((chapter, index) => [
            new Paragraph({
              text: `Chapter ${index + 1}: ${chapter.title}`,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 800, after: 400 },
            }),
            ...parseMarkdownToDocx(chapter.content),
            new Paragraph({ children: [new PageBreak()] }),
          ]),

          // Conclusion
          new Paragraph({
            text: "Final Thoughts",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
          }),
          ...parseMarkdownToDocx(ebook.outline.conclusion),
          
          new Paragraph({
            text: "The End",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { before: 1000 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${ebook.outline.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`);
};

// Simple markdown to docx parser
function parseMarkdownToDocx(markdown: string): Paragraph[] {
  const lines = markdown.split('\n');
  const paragraphs: Paragraph[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('### ')) {
      paragraphs.push(new Paragraph({ text: trimmed.replace('### ', ''), heading: HeadingLevel.HEADING_3 }));
    } else if (trimmed.startsWith('## ')) {
      paragraphs.push(new Paragraph({ text: trimmed.replace('## ', ''), heading: HeadingLevel.HEADING_2 }));
    } else if (trimmed.startsWith('# ')) {
      paragraphs.push(new Paragraph({ text: trimmed.replace('# ', ''), heading: HeadingLevel.HEADING_1 }));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      paragraphs.push(new Paragraph({
        text: trimmed.substring(2),
        bullet: { level: 0 },
      }));
    } else if (trimmed.startsWith('> ')) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: trimmed.replace('> ', ''), italics: true, color: "666666" })],
        indent: { left: 720 },
      }));
    } else {
      // Basic bold/italic handling could be added here, but for now just plain text
      paragraphs.push(new Paragraph({
        children: [new TextRun(trimmed)],
        spacing: { after: 200 },
      }));
    }
  });

  return paragraphs;
}
