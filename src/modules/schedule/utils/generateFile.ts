import {
  AlignmentType, Document, HeadingLevel, Packer,
  PageOrientation,
  Paragraph, Table, TableCell, TableRow, TextRun,
  VerticalAlign, WidthType,
} from 'docx';

export const downloadFile = async (schedule, year, degree) => {

  const doc = new Document();

  const headings = {
    number: '№',
    name: 'Перелік робіт',
    dates: 'Контрольні терміни виконання',
    description: 'Звітні документи',
    notes: 'Примітки',
  };

  const headRow = new TableRow({
    children: Object.keys(headings).map(j => new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: headings[j],
              color: '#000000',
              bold: true,
            })],
          alignment: AlignmentType.CENTER,
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
    })),
  });

  const data = schedule
    .map(i => {
      return ({
        number: i.number,
        name: i.name,
        dates: i.dates,
        description: i.description,
        notes: '',
      });
    });

  const rows = data.map((i) => (
    new TableRow({
      children: Object.keys(i).map(j => new TableCell({
        children: [j === 'number'
          ? new Paragraph({ text: `${i[j]}`, alignment: AlignmentType.CENTER })
          : new Paragraph({ text: `${i[j]}` })],
        verticalAlign: VerticalAlign.CENTER,
      })),
    })
  ));

  const table = new Table({
    rows: [
      headRow,
      ...rows,
    ],
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    columnWidths: [500, 5000, 1568, 5000, 1500],
  });

  doc.addSection({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `${year} - ${degree}`,
            color: '#000000',
            bold: true,
          })],
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 200,
        },
      }),
      table,
    ],
    size: {
      orientation: PageOrientation.LANDSCAPE,
    },
  });

  const stringBase64 = await Packer.toBase64String(doc);
  return stringBase64;
};
