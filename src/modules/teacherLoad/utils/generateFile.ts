import {
  AlignmentType, Document, HeadingLevel, Packer,
  Paragraph, Table, TableCell, TableRow, TextRun,
  VerticalAlign, WidthType,
} from 'docx';

export const downloadFile = async (loads, degrees) => {

  const doc = new Document();

  const headings = {
    number: '№',
    fullName: 'ПІБ викладача',
    total: 'Навантаження',
    ...degrees,
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

  const data = loads
    .sort((a, b) => a.fullName.localeCompare(b.fullName))
    .map((i, idx) => {
      const loadsByDegrees = {};

      i.loadByDegrees.forEach(j => {
        loadsByDegrees[j.name] = j.amount;
      });

      return ({
        number: idx + 1,
        name: i.fullName,
        total: i.total,
        ...loadsByDegrees,
      });
    });

  const rows = data.map((i) => (
    new TableRow({
      children: Object.keys(i).map(j => new TableCell({
        children: [j === 'number'
          ? new Paragraph({ text: `${i[j]}.`, alignment: AlignmentType.CENTER })
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
    columnWidths: [500, 2000, 1800, 1500, 1500, 1500],
  });

  doc.addSection({
    children: [
      table,
    ],
  });

  const stringBase64 = await Packer.toBase64String(doc);
  return stringBase64;
};
