import {
  AlignmentType, Document, HeadingLevel, Packer,
  Paragraph, Table, TableCell, TableRow, TextRun,
  VerticalAlign, WidthType,
} from 'docx';

export const downloadFile = async (themesByGroups, degree) => {

  const doc = new Document();
  const blocks = [];
  const themeDegreeName = degree.includes('Магістр') ? 'магістерської' : 'бакалаврської';

  const headings = [
    {
      number: '№',
      fullName: 'Прізвище, ім’я, по-батькові',
      theme: `Тема ${themeDegreeName} роботи`,
      teacher: 'Керівник',
    },
    {
      number: '1',
      fullName: '2',
      theme: '3',
      teacher: '4',
    },
  ];

  const headRows = headings.map((i, idx) => (
    new TableRow({
      children: Object.keys(i).map(j => new TableCell({
        children: [idx === 1
          ? new Paragraph({ text: i[j], alignment: AlignmentType.CENTER })
          : new Paragraph({ text: i[j] })],
        verticalAlign: VerticalAlign.CENTER,
      })),
    })
  ));

  const headTable = new Table({
    rows: headRows,
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    columnWidths: [500, 2000, 4000, 2000],
  });

  themesByGroups.forEach(item => {

    const transformedThemes = item.themes.map((i, idx) => ({
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
      rows: [
        new TableRow({
          children: Object.keys(headings[1]).map(j => new TableCell({
            children: [new Paragraph({ text: headings[1][j], alignment: AlignmentType.CENTER })],
            verticalAlign: VerticalAlign.CENTER,
          })),
        }),
        ...rows,
      ],
      width: {
        size: 100,
        type: WidthType.AUTO,
      },
      columnWidths: [500, 2000, 4000, 2000],
    });

    blocks.push(
      new Paragraph({}),
      new Paragraph({}),
      new Paragraph({
        children: [new TextRun({
          text: `Спеціальність: ${item.specialty.number} «${item.specialty.name}»`,
          color: '#000000',
          bold: true,
          italics: true,
          underline: {},
        })],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [new TextRun({
          text: `Група ${item.groupName}`,
          color: '#000000',
          bold: true,
        })],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 50,
          after: 50,
        },
      }),
      table,
    );
  });

  doc.addSection({
    children: [
      headTable,
      ...blocks,
    ],
  });

  const stringBase64 = await Packer.toBase64String(doc);
  return stringBase64;
};
