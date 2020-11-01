import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, VerticalAlign, WidthType } from 'docx';

export const downloadFile = async (themes) => {

  const doc = new Document();

  const transformedThemes = themes.map((i, idx) => ({
    id: `${idx + 1}`,
    student: i.student || '',
    name: i.name,
    teacher: i.teacher,
  }));

  const rows = transformedThemes.map((i) => (
    new TableRow({
      children: Object.keys(i).map(j => new TableCell({
        children: [j === 'id'
          ? new Paragraph({ text: i[j], alignment: AlignmentType.CENTER })
          : new Paragraph({ text: i[j] })],
        verticalAlign: VerticalAlign.CENTER,
      })),
    })
  ));

  const table = new Table({
    rows,
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    columnWidths: [500, 2000, 4000, 2000],
  });

  doc.addSection({ children: [table] });

  const stringBase64 = await Packer.toBase64String(doc);
  return stringBase64;
};
