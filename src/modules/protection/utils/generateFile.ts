import { Logger } from '@nestjs/common';
import {
  AlignmentType, Document, HeadingLevel, Packer,
  PageOrientation,
  Paragraph, Table, TableCell, TableRow, TextRun,
  VerticalAlign, WidthType,
} from 'docx';

export const downloadFile = async (protections, group) => {

  const doc = new Document();

  const protectionTypes = {};
  protections.forEach((i, idx) => {
    protectionTypes[`protection${idx + 1}`] = i.protectionType;
  });

  const heading = {
    number: 'Склад комісії',
    fullName: 'Студенти',
    ...protectionTypes,
  };

  let secondHeading = new Array(Object.keys(heading).length);
  secondHeading = secondHeading.map((i, idx) => idx > 1 ? { date: 'Дата', place: 'Місце' } : '');

  const headRow = new TableRow({
    children: Object.keys(heading).map(j => new TableCell({
      children: [new Paragraph({ text: heading[j] })],
      verticalAlign: VerticalAlign.CENTER,
    })),
  });

  const headTable = new Table({
    rows: [
      headRow,
    ],
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    columnWidths: [2000, 2000, 3000, 3000, 3000],
  });

  Logger.log(protections);

  // const rows = protections.map((i) => (
  //   new TableRow({
  //     children: Object.keys(i).map(j => new TableCell({
  //       children: [new Paragraph({ text: i[j] })],
  //       verticalAlign: VerticalAlign.CENTER,
  //     })),
  //   })
  // ));

  // const table = new Table({
  //   rows: [
  //     new TableRow({
  //       children: Object.keys(headings[1]).map(j => new TableCell({
  //         children: [new Paragraph({ text: headings[1][j], alignment: AlignmentType.CENTER })],
  //         verticalAlign: VerticalAlign.CENTER,
  //       })),
  //     }),
  //     ...rows,
  //   ],
  //   width: {
  //     size: 100,
  //     type: WidthType.AUTO,
  //   },
  //   columnWidths: [500, 2000, 4000, 2000],
  // });

  doc.addSection({
    children: [
      new Paragraph({ text: group }),
      headTable,
    ],
    properties: {
      orientation: PageOrientation.LANDSCAPE,
    },
  });

  // themesByGroups.forEach(item => {

  //   const transformedThemes = item.themes.map((i, idx) => ({
  //     id: `${idx + 1}`,
  //     student: i.student || '',
  //     name: i.name,
  //     teacher: i.teacher,
  //   }));

 

  //   blocks.push(
  //     new Paragraph({}),
  //     new Paragraph({}),
  //     new Paragraph({
  //       children: [new TextRun({
  //         text: `Спеціальність: ${item.specialty.number} «${item.specialty.name}»`,
  //         color: '#000000',
  //         bold: true,
  //         italics: true,
  //         underline: {},
  //       })],
  //       heading: HeadingLevel.HEADING_1,
  //       alignment: AlignmentType.CENTER,
  //     }),
  //     new Paragraph({
  //       children: [new TextRun({
  //         text: `Група ${item.groupName}`,
  //         color: '#000000',
  //         bold: true,
  //       })],
  //       heading: HeadingLevel.HEADING_1,
  //       alignment: AlignmentType.CENTER,
  //       spacing: {
  //         before: 50,
  //         after: 50,
  //       },
  //     }),
  //     table,
  //   );
  // });

  const stringBase64 = await Packer.toBase64String(doc);
  return stringBase64;
};
